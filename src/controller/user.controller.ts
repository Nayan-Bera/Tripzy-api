import { Request, Response, NextFunction } from 'express';
import db from '../db';
import { user as users, bookings, properties, favorites } from '../db/schema';
import ResponseHandler from '../utils/responseHandealer';
import { userSchema } from '../validators/user.validator';
// import { userSchema, bookingSchema, profileEditSchema } from "../schemas/userSchemas";

export const userController = {
    async getProfile(req: Request, res: Response, next: NextFunction) {
        const userId = req.user.id;
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
        const userId = req.user.id;
        const { name, phone } = req.body;

        try {
            const updated = await db
                .update(users)
                .set({ name, phone })
                .where(users.id.eq(userId))
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

    async bookRoom(req: Request, res: Response, next: NextFunction) {
        const { error } = bookingSchema.validate(req.body);
        if (error) return next(error);

        const userId = req.user.id;
        const { roomId, startDate, endDate, hours, bookingType } = req.body;

        try {
            const booking = await db
                .insert(bookings)
                .values({
                    userId,
                    roomId,
                    startDate,
                    endDate,
                    hours,
                    bookingType,
                    status: 'booked',
                })
                .returning();

            res.status(201).send(ResponseHandler(201, 'Room booked', booking));
        } catch (err) {
            next(err);
        }
    },

    async getBookings(req: Request, res: Response, next: NextFunction) {
        const userId = req.user.id;
        try {
            const result = await db.query.bookings.findMany({
                where: (b) => b.userId === userId,
            });
            res.status(200).send(
                ResponseHandler(200, 'Bookings fetched', result),
            );
        } catch (err) {
            next(err);
        }
    },

    async cancelBooking(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const userId = req.user.id;

        try {
            const cancel = await db
                .update(bookings)
                .set({ status: 'cancelled' })
                .where(bookings.id.eq(id).and(bookings.userId.eq(userId)))
                .returning();
            res.status(200).send(
                ResponseHandler(200, 'Booking cancelled', cancel),
            );
        } catch (err) {
            next(err);
        }
    },

    async addToFavorites(req: Request, res: Response, next: NextFunction) {
        const userId = req.user.id;
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
                where: (c) => c.code === code && c.expiryDate > new Date(),
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
