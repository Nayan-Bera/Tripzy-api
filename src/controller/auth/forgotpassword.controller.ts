import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';
import { changePasswordSchema, updatePasswordSchema } from '../../validators/auth.validator';
import ResponseHandler from '../../utils/responseHandealer';
import db from '../../db';
import { emailOtp, user } from '../../db/schema';
import { config } from '../../config';



const forgotPasswordController = {
    async changePassword(req: Request, res: Response, next: NextFunction) {
        

        const { error } = changePasswordSchema.validate(req.body);
        if (error) {
            return next(error);
        }

        const { email, otp, password } = req.body;

        try {
            const userRes = await db.query.user.findFirst({
                where: eq(user.email, email)
            })
            if (!userRes) {
                return res
                    .status(404)
                    .send(ResponseHandler(404, 'User not found'));
            }

            const otpEntry = await db.query.emailOtp.findFirst({
                where: eq(emailOtp.user_id, userRes.id)
            })

            if (!otpEntry) {
                return res
                    .status(400)
                    .send(ResponseHandler(400, 'Invalid OTP'));
            }



            if (Number(otpEntry.expiresAt) < Date.now()) {
                await db.delete(emailOtp).where(eq(emailOtp.user_id, userRes.id));
                return res
                    .status(401)
                    .json({ msg: 'Generated OTP is expired, resend now' });
            }
            // Hash the new password
            const hashedPassword = await bcrypt.hash(password, Number(config.SALT));
           
            await db.update(user).set({ password: hashedPassword }).where(eq(user.id, userRes.id));

            // Delete the OTP entry after successful password change
            await db.delete(emailOtp).where(eq(emailOtp.user_id, userRes.id));

            res.status(200).send(
                ResponseHandler(200, 'Password updated successfully'),
            );
        } catch (error) {
            next(error);
        }
    },

    async updatePassword(req: any, res: Response, next: NextFunction) {
        
        const { error } = updatePasswordSchema.validate(req.body);
        if (error) {
            return next(error);
        }

        const { current_password, password } = req.body;
        try {
            // Find the user by email
            const userRes = await db.query.user.findFirst({
                where: eq(user.id, req.user.id)
            })
            if (!userRes) {
                return res
                    .status(404)
                    .send(ResponseHandler(404, 'User not found'));
            }

            // Check if the current password is correct
            const isMatch = await bcrypt.compare(
                current_password,
                userRes.password,
            );
            if (!isMatch) {
                return res
                    .status(200)
                    .send(ResponseHandler(200, 'Incorrect current password'));
            }

            // Hash the new password

            const hashedPassword = await bcrypt.hash(
                password,
                Number(config.SALT),
            );

            // Update the user's password

            await db.update(user).set({ password: hashedPassword }).where(eq(user.id, req.user.id));

            res.status(200).send(ResponseHandler(200, 'success'));
        } catch (error) {
            next(error);
        }
    },
};

export default forgotPasswordController;
