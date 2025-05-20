import { NextFunction, Response } from 'express';
import CustomErrorHandler from '../Services/customErrorHandaler';
import JwtService from '../Services/jwtService';


interface JwtPayload {
    id: string;
    role: string;
}

const auth = async (req: any, res: Response, next: NextFunction) => {
    let authHeader = req.headers.authorization;
    if (!authHeader) {
        return next(CustomErrorHandler.unAuthorized());
    }

    const token = authHeader.split(' ')[1];
    try {
        const { id, role } = (await JwtService.verify(token)) as JwtPayload;
        if (!id || !role) {
            return next(CustomErrorHandler.unAuthorized('Invalid token'));
        }
        const user = {
            id,
            role,
        };
        req.user = user;
        next();
    } catch (err) {
        return next(CustomErrorHandler.unAuthorized());
    }
};

export default auth;
