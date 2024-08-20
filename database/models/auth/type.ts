import { ITimestamps } from "../../../src/types";

export enum EPersonalAccessTokensIdentifiers {
    ADMIN_MODEL = "ADMIN_MODEL",
    USER_MODEL = "USER_MODEL"
}

export type TPersonalAccessTokensIdentifier = typeof EPersonalAccessTokensIdentifiers[keyof typeof EPersonalAccessTokensIdentifiers];

export interface IPersonalAccessTokens extends ITimestamps {
    id: number;
    identifier: TPersonalAccessTokensIdentifier;
    token: string;
    belongs_to: string;
    device_fingerprint: string | null;
    abilities: { [key: string]: any };
    can_expire: boolean;
    expires_at: null | string | Date;
}