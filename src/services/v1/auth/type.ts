import { Types } from "mongoose";
import HttpStatus from "../../../libs/support/statusCode";

export interface IRegister {
    name: string;
    email: string;
    password: string;
}

export interface IRegisterRes {
    name: string;
    email: string;
    _id: Types.ObjectId;
}

export interface IAuthSuccess {
    code: HttpStatus.OK,
    message: string;
    data: {
        id: string;
        name: string;
        email: string;
        token: string;
    }
}

export interface IAuthFailed {
    code: HttpStatus.BAD_REQUEST | HttpStatus.INTERNAL_SERVER_ERROR,
    message: string;
    error: string;
    errors?: Array<string>;
}