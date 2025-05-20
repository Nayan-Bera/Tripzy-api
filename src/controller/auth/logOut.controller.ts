import { eq } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { refreshToken } from '../../db/schema';
import db from '../../db';


const logoutController = {
    async logout(req: Request, res: Response, next: NextFunction) {
        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required(),
        });
        const { error } = refreshSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        try {
            // await RefreshToken.deleteOne({ token: req.body.refresh_token });
            await db.delete(refreshToken).where(eq(refreshToken.token, req.body.refresh_token));
        } catch (err) {
            return next(new Error('Something went wrong in the database'));
        }
        res.json({ status: 1 });
    },
};

export default logoutController;
