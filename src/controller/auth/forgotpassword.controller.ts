import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';
import { changePasswordSchema, updatePasswordSchema } from '../../validators/auth.validator';
import ResponseHandler from '../../utils/responseHandealer';
import db from '../../db';
import { emailOtp, user } from '../../db/schema';
import { config } from '../../config';
import CustomErrorHandler from '../../Services/customErrorHandaler';

const forgotPasswordController = {
    async changePassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { error } = changePasswordSchema.validate(req.body);
            if (error) {
                return next(error);
            }

            const { email, otp, password } = req.body;

            const userRes = await db.query.user.findFirst({
                where: eq(user.email, email)
            });
            
            if (!userRes) {
                return next(CustomErrorHandler.notFound('User not found'));
            }

            const otpEntry = await db.query.emailOtp.findFirst({
                where: eq(emailOtp.user_id, userRes.id)
            });

            if (!otpEntry) {
                return next(CustomErrorHandler.invalid('Invalid OTP'));
            }

            if (Number(otpEntry.expiresAt) < Date.now()) {
                await db.delete(emailOtp).where(eq(emailOtp.user_id, userRes.id));
                return next(CustomErrorHandler.invalid('Generated OTP is expired, resend now'));
            }

            const hashedPassword = await bcrypt.hash(password, Number(config.SALT));
            await db.update(user).set({ password: hashedPassword }).where(eq(user.id, userRes.id));
            await db.delete(emailOtp).where(eq(emailOtp.user_id, userRes.id));

            res.status(200).send(ResponseHandler(200, 'Password updated successfully'));
        } catch (error) {
            next(error);
        }
    },

    async updatePassword(req: any, res: Response, next: NextFunction) {
        try {
            const { error } = updatePasswordSchema.validate(req.body);
            if (error) {
                return next(error);
            }

            const { current_password, password } = req.body;
            const userRes = await db.query.user.findFirst({
                where: eq(user.id, req.user.id)
            });

            if (!userRes) {
                return next(CustomErrorHandler.notFound('User not found'));
            }

            const isMatch = await bcrypt.compare(current_password, userRes.password);
            if (!isMatch) {
                return next(CustomErrorHandler.invalid('Incorrect current password'));
            }

            const hashedPassword = await bcrypt.hash(password, Number(config.SALT));
            await db.update(user).set({ password: hashedPassword }).where(eq(user.id, req.user.id));

            res.status(200).send(ResponseHandler(200, 'Password updated successfully'));
        } catch (error) {
            next(error);
        }
    }
};

export default forgotPasswordController;
