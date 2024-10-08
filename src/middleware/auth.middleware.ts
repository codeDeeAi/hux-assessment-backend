import JWT from '../libs/jwt';
import HttpStatus from '../libs/support/statusCode';
import ApiResponse from '../libs/support/apiResponse';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to verify JWT token and protect routes
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns 
 */
export const protect = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(" ")[1] || "";

    if (!token)
        return ApiResponse
            .error(
                res,
                HttpStatus.UNAUTHORIZED,
                'Access denied',
                'You are unauthenticated');

    try {

        const id = await JWT.Verify(token);

        if (id == null)
            return ApiResponse
                .error(
                    res,
                    HttpStatus.UNAUTHORIZED,
                    'Access denied',
                    'Invalid token');

        next();

    } catch (error: any) {
        return ApiResponse
            .error(
                res,
                HttpStatus.UNAUTHORIZED,
                'Access denied',
                'Invalid token');
    }
};