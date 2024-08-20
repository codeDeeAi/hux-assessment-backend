import { IMedia } from "../media/type";
import { ITimestamps } from "../../../src/types";

export interface IAdmin extends ITimestamps {
    id: string;
    staff_id: string;
    first_name: string;
    last_name: string;
    other_names: string | null;
    avatar_id: null | number;
    email: string;
    password: string;
    enabled: boolean;
} 


export interface IAdminWithRelations extends IAdmin {
    avatar: null | IMedia
}