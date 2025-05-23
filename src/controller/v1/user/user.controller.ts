import { and, eq, gt } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';
import db from '../../../db';
import { coupons, favorites, properties, user as users } from '../../../db/schema';
import ResponseHandler from '../../../utils/responseHandealer';
// import { userSchema, bookingSchema, profileEditSchema } from "../schemas/userSchemas";

const userController = {
    
    async getProfile(req: Request, res: Response, next: NextFunction) {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).send(ResponseHandler(401, "User not authenticated"));
        }
        try {
            const user = await db.query.user.findFirst({
                where: eq(users.id, userId),
            });
            res.status(200).send(ResponseHandler(200, 'Profile fetched', user));
        } catch (err) {
            next(err);
        }
    },

    async editProfile(req: Request, res: Response, next: NextFunction) {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).send(ResponseHandler(401, "User not authenticated"));
        }
        const { name, phone } = req.body;

        try {
            const updated = await db
                .update(users)
                .set({ fullname: name, phone_number: phone })
                .where(eq(users.id, userId))
                .returning();
            res.status(200).send(
                ResponseHandler(200, 'Profile updated', updated),
            );
        } catch (err) {
            next(err);
        }
    },

    async getProperties(req: Request, res: Response, next: NextFunction) {
        try {
            const list = await db.query.properties.findMany({
                where: eq(properties.status, 'active'),
            });
            res.status(200).send(
                ResponseHandler(200, 'Properties fetched', list),
            );
        } catch (err) {
            next(err);
        }
    },

    async addToFavorites(req: Request, res: Response, next: NextFunction) {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).send(ResponseHandler(401, "User not authenticated"));
        }
        const { propertyId } = req.body;

        try {
            const fav = await db
                .insert(favorites)
                .values({ userId, propertyId })
                .returning();
            res.status(201).send(
                ResponseHandler(201, 'Added to favorites', fav),
            );
        } catch (err) {
            next(err);
        }
    },

    async applyCoupon(req: Request, res: Response, next: NextFunction) {
        const { code } = req.body;
        try {
            const coupon = await db.query.coupons.findFirst({
                where: and(eq(coupons.code, code), gt(coupons.endDate, new Date().toISOString()))
            });
            if (!coupon)
                return res
                    .status(400)
                    .send(ResponseHandler(400, 'Invalid or expired coupon'));

            res.status(200).send(
                ResponseHandler(200, 'Coupon applied', coupon),
            );
        } catch (err) {
            next(err);
        }
    },
};

export default userController;
