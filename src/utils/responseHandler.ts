import { Response } from 'express';

export function handleResponse(res: Response, status: number, message: string, data?: object | null) {
    return res.status(status).json({
        status,
        message,
        data,
    });
} 