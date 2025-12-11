"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
const zod_1 = require("zod");
const logger_1 = __importDefault(require("../utils/logger"));
class AppError extends Error {
    constructor(message, statusCode = 500) {
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
exports.AppError = AppError;
// helper to convert unknown error into AppError
const toAppError = (err) => {
    // If already AppError -> return as-is
    if (err instanceof AppError)
        return err;
    if (err instanceof zod_1.ZodError) {
        const firstIssue = err.issues[0];
        const message = firstIssue
            ? `${firstIssue.path.join('.')}: ${firstIssue.message}`
            : 'Invalid input data';
        return new AppError(message, 400);
    }
    // Handle certain known error shapes by name (JWT / Sequelize etc.)
    const anyErr = err;
    if ((anyErr === null || anyErr === void 0 ? void 0 : anyErr.name) === 'JsonWebTokenError') {
        return new AppError('Invalid token. Please log in again!', 401);
    }
    if ((anyErr === null || anyErr === void 0 ? void 0 : anyErr.name) === 'TokenExpiredError') {
        return new AppError('Your token has expired! Please log in again.', 401);
    }
    if ((anyErr === null || anyErr === void 0 ? void 0 : anyErr.name) === 'SequelizeUniqueConstraintError') {
        return new AppError('Duplicate field value entered', 400);
    }
    if ((anyErr === null || anyErr === void 0 ? void 0 : anyErr.name) === 'SequelizeValidationError') {
        return new AppError('Invalid input data', 400);
    }
    // Default: unwrap message if exists, otherwise generic server error
    const message = (anyErr && anyErr.message) || 'An unexpected error occurred';
    const statusCode = typeof (anyErr === null || anyErr === void 0 ? void 0 : anyErr.statusCode) === 'number' ? anyErr.statusCode : 500;
    return new AppError(message, statusCode);
};
const errorHandler = (err, req, res, _next) => {
    const appError = toAppError(err);
    const isDev = process.env.NODE_ENV === 'development';
    // Log full error in dev, and important info in prod
    if (isDev) {
        logger_1.default.error('Error 💥', {
            error: err,
            stack: err === null || err === void 0 ? void 0 : err.stack,
            path: req.path,
            method: req.method,
        });
        return res.status(appError.statusCode).json({
            status: appError.status,
            error: err,
            message: appError.message,
            stack: err === null || err === void 0 ? void 0 : err.stack,
        });
    }
    // Production: log sanitized
    logger_1.default.error('Error 💥', {
        message: appError.message,
        path: req.path,
        method: req.method,
        // optional include isOperational flag for monitoring
        isOperational: appError.isOperational,
    });
    // Send only safe details to client
    return res.status(appError.statusCode).json({
        status: appError.status,
        message: appError.message,
    });
};
exports.errorHandler = errorHandler;
