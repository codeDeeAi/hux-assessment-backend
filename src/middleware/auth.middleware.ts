import jsonwebtoken from 'jsonwebtoken';
import ApiResponse from '../libs/support/apiResponse';
import { Request, Response, NextFunction } from 'express';
import HttpStatus from '../libs/support/statusCode';
import JWT from '../libs/jwt';

/**
 * Middleware to verify JWT token and protect routes
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns 
 */
const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization');

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

        req.user_id = id;

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

module.exports = verifyToken;