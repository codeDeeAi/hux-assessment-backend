import jsonwebtoken from 'jsonwebtoken';
import ApiResponse from '../libs/support/apiResponse';
import { Request, Response, NextFunction } from 'express';
import HttpStatus from '../libs/support/statusCode';

/**
 * Middleware to verify JWT token and protect routes
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns 
 */
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization');

    if (!token)
        return ApiResponse
            .error(
                res,
                HttpStatus.UNAUTHORIZED,
                'Access denied',
                'You are unauthenticated');

    try {
        const decoded = jsonwebtoken.verify(token, 'your-secret-key');

        // req.userId = decoded.userId;

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