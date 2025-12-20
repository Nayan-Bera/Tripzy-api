import { RequestHandler } from 'express';
import CustomErrorHandler from '../../../Services/customErrorHandaler';
import db from '../../../db';
import { role } from '../../../db/schema';
import ResponseHandler from '../../../utils/responseHandealer';

export const addrole: RequestHandler = async (req, res, next) => {
    try {
        const { name } = req.body;
        if (!name) {
            return next(
                CustomErrorHandler.wrongCredentials('Role name is required'),
            );
        }
        await db.insert(role).values({ name }).returning();

        res.status(201).send(ResponseHandler(201, 'Role added successfully'));
    } catch (error) {
        return next(error);
    }
};
