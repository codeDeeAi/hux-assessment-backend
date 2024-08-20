import { ITimestamps } from "../../../src/types";

export enum EAdminPermissionTags {
    CREATE = "CREATE",
    READ = "READ",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    IMPORT = "IMPORT",
    EXPORT = "EXPORT"
};

export type TAdminPermissionTag = keyof typeof EAdminPermissionTags;

export interface IAdminPermission extends ITimestamps {
    id: number;
    name: string;
    tag: TAdminPermissionTag;
    identifier: string;
    description: string | null;
    immutable: boolean;
};