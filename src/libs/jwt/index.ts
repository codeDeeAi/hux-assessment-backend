import { Types } from "mongoose";
import Env from "../support/env";
import jsonwebtoken from 'jsonwebtoken';
import BlackListToken from "../../models/BlacklistToken.model";


/**
 * Class providing methods for signing and verifying JSON Web Tokens (JWT).
 * @class JWT
 * @author Adeola Bada
 */
export default class JWT {
    constructor() {
        //
    }

    /**
    * Signs a JWT with the given user ID and expiration time.
    * @param {Types.ObjectId} user_id - The user ID to include in the token payload.
    * @param {number} expires_in_hours - The number of hours after which the token should expire.
    * @returns {string} The signed JWT.
    */
    public static Sign(user_id: Types.ObjectId, expires_in_hours: number): string {
        const token = jsonwebtoken.sign({ user_id: user_id }, Env.JWT_SECRET_KEY, {
            expiresIn: `${expires_in_hours}h`,
        });

        return token;
    }

    /**
    * Verifies a JWT and returns the user ID if the token is valid.
    * @param {string} token - The JWT to verify.
    * @returns {Promise<string | null>} The user ID from the token payload if valid, otherwise null.
    * @throws {Error} If verification fails or the token is invalid.
    */
    public static async Verify(token: string): Promise<string | null> {
        try {
            const decoded = jsonwebtoken.verify(token, Env.JWT_SECRET_KEY);

            if (typeof decoded === 'string')
                return null;

            const query = await BlackListToken.findOne({ token: token })

            if (query)
                return null;

            if (!('user_id' in decoded))
                return null;

            return decoded.user_id;

        } catch (error: any) {

            throw new Error(error?.message || JSON.stringify(error));

        }
    }

    /**
     * Blacklists a JWT token by saving it to the blacklist collection.
     * @param {string} token - The JWT token to be blacklisted.
     * @returns {Promise<boolean>} A promise that resolves to `true` if the token is successfully blacklisted.
     * @throws {Error} If there is an error during the blacklisting process.
     */
    public static async BlacklistToken(token: string): Promise<boolean> {
        try {

            const blacklisted = await new BlackListToken({
                token
            }).save();

            if (!blacklisted)
                throw new Error("Error blacklisting token");

            return true;

        } catch (error: any) {
            throw new Error(error?.message || JSON.stringify(error));
        }
    }
}