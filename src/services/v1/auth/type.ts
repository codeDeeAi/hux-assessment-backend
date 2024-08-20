import HttpStatus from "../../../libs/support/statusCode";

interface IAuthRole {
    id: number;
    name: string;
}

export interface IAuthSuccess {
    code: HttpStatus.OK,
    message: string;
    data: {
        id: string | number;
        first_name: string;
        last_name: string;
        email: string;
        staff_id: string;
        avatar: string | null;
        roles: Array<IAuthRole>;
        permissions: Array<string>;
        token: string;
    }
}

export interface IAuthFailed {
    code: HttpStatus.BAD_REQUEST | HttpStatus.INTERNAL_SERVER_ERROR,
    message: string;
    error: string;
    errors?: Array<string>;
}