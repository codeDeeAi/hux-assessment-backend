import * as crypto from "crypto";
import { and, eq } from "drizzle-orm";
import {
  EPersonalAccessTokensIdentifiers,
  TPersonalAccessTokensIdentifier,
} from "../../../../database/models/auth/type";
import AppConfig from "../../../libs/core/app";
import Redis from "../../../libs/caching/redis";
import Env from "../../../libs/support/env";
import { personal_access_token } from "../../../../database/models";

export interface SaveTokenResInterface {
  status: boolean;
  error?: any | null;
  data?: any;
}

export interface IGenerateAndSaveTokenOptions {
  user: string;
  identifier: TPersonalAccessTokensIdentifier;
  deviceFingerprint: string | null;
  canExpire: boolean;
  abilities?: { [key: string]: any };
  expiryInHrs: number | null;
}

export interface ISaveTokenOptions {
  user: string;
  identifier: TPersonalAccessTokensIdentifier;
  token: string;
  deviceFingerprint: string | null;
  canExpire: boolean;
  abilities?: { [key: string]: any };
  expiryInHrs: number | null;
}
export interface TokenPayload {
  userId: string;
  identifier: TPersonalAccessTokensIdentifier;
  canExpire: boolean;
  exp: number | null;
}

/**
 * Generate Auth Cache Key Prefix
 * @param {TPersonalAccessTokensIdentifier} identifier
 * @returns {String}
 */
export const generateCacheKeyPrefix = (
  identifier: TPersonalAccessTokensIdentifier,
): string => {
  let prefix = "";

  switch (identifier) {
    case EPersonalAccessTokensIdentifiers.ADMIN_MODEL:
      prefix = "ADMIN_AUTH_TOKEN_";

      break;

    default:
      prefix = "AUTH_TOKEN_";

      break;
  }

  return prefix;
};

/**
 * Generates and saves a token.
 *
 * @param {IGenerateAndSaveTokenOptions} options - Options for token generation and saving.
 * @returns {Promise<string | null>} - A Promise that resolves to the generated token or null if an error occurs.
 *
 * @throws {Error} - Throws an error if there's an issue generating or saving the token.
 */
export const generateAndSaveToken = async (options: IGenerateAndSaveTokenOptions): Promise<string | null> => {
  try {
    const {
      user,
      canExpire,
      abilities,
      identifier,
      expiryInHrs,
      deviceFingerprint,
    } = options;

    const token = createToken({
      canExpire,
      identifier,
      userId: user,
      exp: expiryInHrs
    } as TokenPayload);

    const { status, error, data } = await saveToken({
      user,
      token,
      abilities,
      canExpire,
      identifier,
      expiryInHrs,
      deviceFingerprint,
    } as ISaveTokenOptions);

    if (!status)
      throw new Error(error || 'Error generating token');

    return data as string;

  } catch (error: any) {

    return null;
  }
}

/**
 * Create New Personal Access Token
 * @param {ISaveTokenOptions} options
 * @returns {Promise<SaveTokenResInterface>}
 */
export const saveToken = async (
  options: ISaveTokenOptions,
): Promise<SaveTokenResInterface> => {
  try {
    const {
      user,
      identifier,
      token,
      deviceFingerprint,
      canExpire,
      abilities,
      expiryInHrs,
    } = options;

    const db = AppConfig.getConfigKey("db");

    if (canExpire && (!expiryInHrs || expiryInHrs == null))
      throw new Error("expiry in hours not set");

    const calculateExpiry = (expiryInHrs: number): Date => {
      const currentTimestamp = new Date();

      return new Date(
        currentTimestamp.getTime() + expiryInHrs * 60 * 60 * 1000,
      );
    };

    const newToken = {
      identifier,
      token,
      belongs_to: user,
      device_fingerprint: deviceFingerprint,
      can_expire: canExpire,
      ...(abilities && { abilities }),
      ...(expiryInHrs !== null && { expires_at: calculateExpiry(expiryInHrs) }),
    };

    const accessToken = await db
      ?.insert(personal_access_token)
      .values(newToken);

    return {
      status: true,
      error: null,
      data: token,
    };
  } catch (error: any) {
    return {
      status: false,
      error: error,
    };
  }
};

/**
 * Delete a Personal Access Token
 * @param {string| number} token_id
 * @param {TPersonalAccessTokensIdentifier} identifier
 * @returns {boolean}
 */
export const deleteToken = async (
  token_id: string | number,
  identifier: TPersonalAccessTokensIdentifier = EPersonalAccessTokensIdentifiers.USER_MODEL,
): Promise<boolean> => {
  try {
    const db = AppConfig.getConfigKey("db");

    const access_token = await db?.query.personal_access_token.findFirst({
      where: and(
        eq(personal_access_token.id, token_id as number),
        eq(personal_access_token.identifier, identifier),
      ),
    });

    if (!access_token) throw new Error("Cannot find access token");

    const deletedDoc = await db
      ?.delete(personal_access_token)
      .where(
        and(
          eq(personal_access_token.id, token_id as number),
          eq(personal_access_token.identifier, identifier),
        ),
      );

    const prefix = generateCacheKeyPrefix(identifier);

    await Redis.delete(`${prefix}${access_token.token}`);

    return deletedDoc ? true : false;
  } catch (error: any) {
    return false;
  }
};

/**
 * Delete all Personal Access Tokens
 * @param {string} user_id
 * @param {TPersonalAccessTokensIdentifier} identifier
 * @param {boolean} logout
 * @returns {boolean}
 */
export const deleteAllModelTokens = async (
  user_id: string,
  identifier: TPersonalAccessTokensIdentifier,
  logout: boolean = true,
): Promise<boolean> => {
  try {
    const db = AppConfig.getConfigKey("db");

    const access_tokens = await db?.query.personal_access_token.findMany({
      where: and(
        eq(personal_access_token.belongs_to, user_id),
        eq(personal_access_token.identifier, identifier),
      ),
    });

    access_tokens?.forEach(async (p_a_t): Promise<void> => {
      await db
        ?.delete(personal_access_token)
        .where(eq(personal_access_token.id, p_a_t.id));

      if (logout) {
        const prefix = generateCacheKeyPrefix(identifier);

        const is_in_cache = await Redis.get(`${prefix}${p_a_t.token}`);

        if (is_in_cache !== null) await Redis.delete(`${prefix}${p_a_t.token}`);
      }
    });

    return true;
  } catch (error: any) {
    return false;
  }
};

/**
 * Creates a JSON Web Token (JWT).
 *
 * @param {TokenPayload} payload - The payload to be encoded in the token.
 * @returns {string} The generated JWT token.
 */
export const createToken = (payload: TokenPayload): string => {
  const header = { alg: "HS256", typ: "JWT" }; // Custom header
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString(
    "base64url",
  );
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    "base64url",
  );

  const signingString = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto
    .createHmac("sha256", Env.APP_ENC_KEY)
    .update(signingString)
    .digest("base64url");

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

/**
 * Verifies and decodes a JWT token.
 *
 * @param {string} token - The JWT token to verify.
 * @returns {TokenPayload | null} The decoded token payload if valid, null otherwise.
 */
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const [encodedHeader, encodedPayload, signature] = token.split(".");

    // Decode header and payload
    const header = JSON.parse(
      Buffer.from(encodedHeader, "base64url").toString(),
    );
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString(),
    );

    // Recreate signing string and calculate signature
    const signingString = `${encodedHeader}.${encodedPayload}`;
    const calculatedSignature = crypto
      .createHmac("sha256", Env.APP_ENC_KEY)
      .update(signingString)
      .digest("base64url");

    // Verify signature
    if (signature !== calculatedSignature) {
      throw new Error("Invalid signature");
    }

    return payload;
  } catch (error: any) {
    return null;
  }
};
