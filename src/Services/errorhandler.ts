import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'joi';
import CustomErrorHandler from './customErrorHandaler';
import ResponseHandler from '../utils/responseHandealer';


const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next?: NextFunction,
) => {
    let statusCode = 500;
    let errData = {
        message: 'Internal Server Error',
        // ...(config.DEBUG_MODE === 'true' && { originError: err.message })
    };

    if (err instanceof ValidationError) {
        statusCode = 422;
        errData = {
            message: err.message,
        };
    }

    if (err instanceof CustomErrorHandler) {
        statusCode = err.status;
        errData = err.toJson();
    }

    res.status(statusCode).send(ResponseHandler(statusCode, errData.message));
};

export default errorHandler;
