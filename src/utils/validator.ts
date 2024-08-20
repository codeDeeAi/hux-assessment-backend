import { Request, Response } from 'express';
import express from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import ApiResponse from '../libraries/support/apiResponse';
import HttpStatus from '../libraries/support/statusCode';

interface ErrorRes {
    type: string;
    value: any;
    msg: string;
    path: string;
    location: string;
}

/**
 * Throw validation Error
 * @param {Request} req
 * @param {Response} res
 * @return {Response|Void}
 */
export const throwValidatorError = (req: Request, res: Response): Response | void => {

    const result = validationResult(req);

    if (!result.isEmpty()) {
        const { msg } = result.array()[0];

        return ApiResponse.error(
            res,
            HttpStatus.UNPROCESSABLE,
            msg ? msg : "",
            msg ? msg : "",
            result.array()
        );
    }
}

// sequential processing, stops running validations chain if the previous one fails.
export const validate = (validations: ValidationChain[]) => {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        for (const validation of validations) {
            const result = await validation.run(req);
            if (!result.isEmpty()) {
                const { msg } = result.array()[0]
                return ApiResponse.error(
                    res,
                    HttpStatus.UNPROCESSABLE,
                    msg ? msg : "",
                    msg ? msg : "",
                    result.array()
                );
            }
        }

        // If no errors, proceed to the next middleware or route handler
        next();
    };
};

/**
 * Run custom validation
 * @param {CallableFunction} cb 
 * @returns 
 */
export const customValidate = (cb: CallableFunction) => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        cb(req, res, next);
    };
};

/**
 * Custom error response for custom validate function
 * @param { express.Response } res 
 * @param { ErrorRes | Array<ErrorRes> } error 
 * @returns 
 */
export const customResponse = (res: express.Response, error: ErrorRes | Array<ErrorRes>) => {
    const errors = (Array.isArray(error)) ? error : [error];

    const msg = errors[0].msg;

    return ApiResponse.error(
        res,
        HttpStatus.UNPROCESSABLE,
        msg ? msg : "",
        msg ? msg : "",
        errors
    );
}

