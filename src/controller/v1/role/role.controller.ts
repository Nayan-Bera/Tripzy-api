import { RequestHandler } from 'express';
import CustomErrorHandler from '../../../Services/customErrorHandaler';
import db from '../../../db';
import { role } from '../../../db/schema';
import ResponseHandler from '../../../utils/responseHandealer';
import { eq } from 'drizzle-orm';

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
export const getRole: RequestHandler = async (req, res, next) => {
    try {
        const roles = await db.query.role.findMany();

        res.status(200).send(
            ResponseHandler(200, 'Role fetched successfully', roles),
        );
    } catch (error) {
        return next(error);
    }
};
export const updateRole: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        if (!name) {
            return next(
                CustomErrorHandler.wrongCredentials('Role name is required'),
            );
        }
        await db.update(role).set({ name }).where(eq(role.id, id)).returning();

        res.status(201).send(ResponseHandler(201, 'Role updated successfully'));
    } catch (error) {
        return next(error);
    }
};
