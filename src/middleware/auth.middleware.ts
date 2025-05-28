import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './error.middleware';
import config from '../config';
import { users } from '../db/schema/user';
import { eq } from 'drizzle-orm';
import db from '../db';

export interface AuthenticatedRequest extends Request {
    user?: any;
}

export const protect = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        // 1) Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return next(new AppError('Please log in to access this resource', 401));
        }

        const token = authHeader.split(' ')[1];

        // 2) Verify token
        const decoded = jwt.verify(token, config.jwt.secret) as any;

        // 3) Check if user still exists
        const [user] = await db.select().from(users).where(eq(users.id, decoded.id));
        if (!user) {
            return next(new AppError('User no longer exists', 401));
        }

        // 4) Grant access
        req.user = user;
        next();
    } catch (error) {
        next(new AppError('Invalid token. Please log in again', 401));
    }
};

export const restrictTo = (...roles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError('You do not have permission to perform this action', 403)
            );
        }
        next();
    };
}; 