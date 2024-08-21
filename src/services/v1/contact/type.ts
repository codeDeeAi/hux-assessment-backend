import { Types } from "mongoose";
export interface ICreate {
    first_name: string;
    last_name: string;
    phone_number: string;
}

export interface IUpdate {
    id: Types.ObjectId;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
}