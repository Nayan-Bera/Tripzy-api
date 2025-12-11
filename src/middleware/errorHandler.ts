// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import logger from '../utils/logger';

class AppError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;

    constructor(message: string, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        // Capture stack trace (V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

// helper to convert unknown error into AppError
const toAppError = (err: unknown): AppError => {
    // If already AppError -> return as-is
    if (err instanceof AppError) return err;

    if (err instanceof ZodError) {
        const firstIssue = err.issues[0];
        const message = firstIssue
            ? `${firstIssue.path.join('.')}: ${firstIssue.message}`
            : 'Invalid input data';

        return new AppError(message, 400);
    }

    // Handle certain known error shapes by name (JWT / Sequelize etc.)
    const anyErr = err as any;

    if (anyErr?.name === 'JsonWebTokenError') {
        return new AppError('Invalid token. Please log in again!', 401);
    }

    if (anyErr?.name === 'TokenExpiredError') {
        return new AppError(
            'Your token has expired! Please log in again.',
            401,
        );
    }

    if (anyErr?.name === 'SequelizeUniqueConstraintError') {
        return new AppError('Duplicate field value entered', 400);
    }

    if (anyErr?.name === 'SequelizeValidationError') {
        return new AppError('Invalid input data', 400);
    }

    // Default: unwrap message if exists, otherwise generic server error
    const message =
        (anyErr && anyErr.message) || 'An unexpected error occurred';
    const statusCode =
        typeof anyErr?.statusCode === 'number' ? anyErr.statusCode : 500;

    return new AppError(message, statusCode);
};

const errorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    _next: NextFunction,
) => {
    const appError = toAppError(err);

    const isDev = process.env.NODE_ENV === 'development';

    // Log full error in dev, and important info in prod
    if (isDev) {
        logger.error('Error 💥', {
            error: err,
            stack: (err as any)?.stack,
            path: req.path,
            method: req.method,
        });

        return res.status(appError.statusCode).json({
            status: appError.status,
            error: err,
            message: appError.message,
            stack: (err as any)?.stack,
        });
    }

    // Production: log sanitized
    logger.error('Error 💥', {
        message: appError.message,
        path: req.path,
        method: req.method,
        // optional include isOperational flag for monitoring
        isOperational: (appError as any).isOperational,
    });

    // Send only safe details to client
    return res.status(appError.statusCode).json({
        status: appError.status,
        message: appError.message,
    });
};

export { AppError, errorHandler };
