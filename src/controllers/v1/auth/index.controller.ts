import { Request, Response } from "express";
import { validate } from "../../../utils/validator";
import HttpStatus from "../../../libs/support/statusCode";
import ApiResponse from "../../../libs/support/apiResponse";
import Authentication from "../../../services/v1/auth/authentication.service";
import { registerValidation, loginValidation } from "./validations/auth.validation";


/**
 * Register user
 * @param {Request} req
 * @param {Response} res
 * @return {Response}
 */
export const register = [validate(registerValidation), async (req: Request, res: Response) => {

    try {

        const { email, name, password } = req.body;

        const user = await new Authentication().Register({
            email, name, password
        });

        return ApiResponse.created(res, 'User registered successfully', user);

    } catch (error: any) {

        return ApiResponse.serverError(res, "Error registering user", error.message || JSON.stringify(error));
    }
}];

/**
 * Login user
 * @param {Request} req
 * @param {Response} res
 * @return {Response}
 */
export const login = [validate(loginValidation), async (req: Request, res: Response) => {

    try {
        const { email, password } = req.body;

        const result = await new Authentication().Login(email, password);

        if (result.code === HttpStatus.OK)
            return ApiResponse.success(res, result.message, result.data);

        const { code, message, error, errors } = result;

        return ApiResponse.jsonRes(res, code, message, null, error, errors);

    } catch (error: any) {

        return ApiResponse.serverError(res, "Error authenticating user", error.message || JSON.stringify(error));
    }
}];

/**
 * Logout user
 * @param {Request} req
 * @param {Response} res
 * @return {Response}
 */
export const logout = [validate([]), async (req: Request, res: Response) => {

    try {
        const token = req.header('Authorization');

        if(!token)
            return ApiResponse.badRequest(res, 'Invalid or missing token');

        const result = await new Authentication().Logout(token);

        if (!result)
            throw new Error("Error logging out user");


        return ApiResponse.success(res, 'User logged out successfully', null);

    } catch (error: any) {

        return ApiResponse.serverError(res, "Error logging out user", error.message || JSON.stringify(error));
    }
}];