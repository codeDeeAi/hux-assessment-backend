import { Response } from "express";
import HttpStatus from "./statusCode";

interface JsonData {
    code: number;
    message: string;
    data: any;
    error: string | null;
    errors?: Array<any>;
}

/**
 * ApiResponse Class for Api Responses
 * @author Adeola Bada
 */
class ApiResponse {

    /**
     * Send a JSON response with a given status code and data.
     * @param {Response} res- Express Response object
     * @param {Number} statusCode - HTTP status code
     * @param {String} message - Message
     * @param {Any} data - Data to be sent as JSON
     * @param {String|Null} error - Error if any
     * @param {Any[]} errors - List of errors if any
     * @return { Response }
     */
    static jsonRes(
        res: Response,
        statusCode: number,
        message: string,
        data: any,
        error: string | null = null,
        errors?: any[]
    ): Response {

        const resData: JsonData = {
            code: statusCode,
            message: message,
            data: data,
            error: error,
            ...(errors) && { errors: errors }
        }

        return res.status(statusCode).json(resData);
    }

    /**
     * Send a success JSON response with a given data.
     * @param {Response} res - Express Response object.
     * @param {String} message - Message
     * @param {Any} data - Data to be sent as JSON
     * @param {Number} statusCode - HTTP status code
     * @return { Response }
     */
    static success(res: Response, message: string, data: any = null, statusCode = HttpStatus.OK): Response {
        return ApiResponse.jsonRes(
            res,
            statusCode,
            message,
            data
        );
    }

    /**
     * Send a bad request JSON response with a given data.
     * @param {Response} res - Express Response object.
     * @param {String} message - Message
     * @param {Any} data - Data to be sent as JSON
     * @param {Number} statusCode - HTTP status code
     * @return { Response }
     */
    static badRequest(res: Response, message: string, data: any = null, statusCode = HttpStatus.BAD_REQUEST): Response {
        return ApiResponse.jsonRes(
            res,
            statusCode,
            message,
            data
        );
    }

    /**
     * Send a created success JSON response with a given data.
     * @param {Response} res - Express Response object.
     * @param {String} message - Message
     * @param {Any} data - Data to be sent as JSON
     * @param {Number} statusCode - HTTP status code (201)
     * @return { Response }
     */
    static created(res: Response, message: string, data: any = null, statusCode = HttpStatus.CREATED): Response {
        return ApiResponse.jsonRes(
            res,
            statusCode,
            message,
            data
        );
    }

    /**
     * Send an error JSON response with a given error message and status code.
     * @param {Response} res - Express Response object.
     * @param {String} message - Message
     * @param {String|Null} error - Error if any
     * @param {Any[]} errors - List of errors if any
     * @return { Response }
     */
    static error(res: Response, statusCode: number, message: string, error: string, errors?: any[]): Response {
        return ApiResponse.jsonRes(
            res,
            statusCode,
            message,
            null,
            error,
            errors
        );
    }

     /**
     * Send a not found error JSON response with a given error message and status code.
     * @param {Response} res - Express Response object.
     * @param {String} message - Message
     * @param {String|Null} error - Error if any
     * @param {Any[]} errors - List of errors if any
     * @return { Response }
     */
     static notFound(res: Response, message: string, error: string, errors?: any[]): Response {
        return ApiResponse.jsonRes(
            res,
            HttpStatus.NOT_FOUND,
            message,
            null,
            error,
            errors
        );
    }

    /**
     * Send a server error JSON response with a given error message and status code.
     * @param {Response} res - Express Response object.
     * @param {String} message - Message
     * @param {String} message - Message
     * @param {Any} data - Data to be sent as JSON
     * @return { Response }
     */
    static serverError(res: Response, message: string, error: string | null = "Server error !"): Response {
        return ApiResponse.jsonRes(
            res,
            HttpStatus.INTERNAL_SERVER_ERROR,
            message,
            null,
            error
        );
    }
}

// Export the ApiResponse class
export default ApiResponse;
