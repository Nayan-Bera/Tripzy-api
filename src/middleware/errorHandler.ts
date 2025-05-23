import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import logger from '../utils/logger';

class AppError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        logger.error('Error 💥', {
            error: err,
            stack: err.stack,
            path: req.path,
            method: req.method,
        });

        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    } else {
        // Production mode
        if (err instanceof ZodError) {
            err.statusCode = 400;
            err.message = 'Invalid input data';
        }

        if (err.name === 'JsonWebTokenError') {
            err = new AppError('Invalid token. Please log in again!', 401);
        }

        if (err.name === 'TokenExpiredError') {
            err = new AppError('Your token has expired! Please log in again.', 401);
        }

        if (err.name === 'SequelizeUniqueConstraintError') {
            err = new AppError('Duplicate field value entered', 400);
        }

        if (err.name === 'SequelizeValidationError') {
            err = new AppError('Invalid input data', 400);
        }

        logger.error('Error 💥', {
            error: err,
            path: req.path,
            method: req.method,
        });

        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
};

export { AppError, errorHandler }; 