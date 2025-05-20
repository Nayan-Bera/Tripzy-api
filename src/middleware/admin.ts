import { NextFunction, Response } from 'express';

import db from '../db';
import { eq } from 'drizzle-orm';
import { user } from '../db/schema';
import roles from '../constant/role';
import CustomErrorHandler from '../Services/customErrorHandaler';

const admin = async (req: any, res: Response, next: NextFunction) => {
    try {
        const userRes = await db.query.user.findFirst({
            where: eq(user?.id, req.user.id),
        });
        if (
            userRes?.role === roles.ADMIN ||
            userRes?.role === roles.SUPER_ADMIN
        ) {
            if (userRes?.email_verified) {
                next();
            } else {
                return next(
                    CustomErrorHandler.notAllowed('User is not verified'),
                );
            }
        } else {
            return next(CustomErrorHandler.unAuthorized());
        }
    } catch (err: any) {
        return next(CustomErrorHandler.serverError(err.message));
    }
};

export default admin;
