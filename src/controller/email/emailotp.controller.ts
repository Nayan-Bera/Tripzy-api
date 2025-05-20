import { eq } from 'drizzle-orm';
import { NextFunction, Response } from 'express';
import { emailOtp, user } from '../../db/schema';
import ResponseHandler from '../../utils/responseHandealer';
import db from '../../db';
import CustomErrorHandler from '../../Services/customErrorHandaler';
import emailOtpService from '../../Services/emailOtpService';


const emailVerification = {
    async verifyOtp(req: any, res: Response, next: NextFunction) {
        const { otp } = req.body;
        const id = req.user.id;
        try {
            const isExist = await db.query.emailOtp.findMany({
                where: eq(emailOtp.user_id, id)
            })
            

            if (isExist.length === 0) {
                return res
                    .status(401)
                    .json({ msg: 'Please login or register the account' });
            }
            const expires = Number(isExist[0].expiresAt);

            if (expires < Date.now()) {
                await db.delete(emailOtp).where(eq(emailOtp.user_id, id));
                return res
                    .status(401)
                    .json({ msg: 'Generated OTP is expired, resend now' });
            }

            if (isExist[0]?.otp !== otp) {
                return res
                    .status(401)
                    .json({ msg: 'Invalid OTP check your inbox' });
            }

            const updatedUser = await db.update(user).set({ email_verified: true }).where(eq(user.id, id)).returning({
                email_verified: user.email_verified
            });

            await db.delete(emailOtp).where(eq(emailOtp.id, isExist[0].id));
          

            res.status(201).send(
                ResponseHandler(201, 'Email verified successfuly', {
                    email_verified: updatedUser[0]?.email_verified,
                }),
            );
        } catch (error) {
          
            return next(error);
        }
    },

    async resendOtp(req: any, res: Response, next: NextFunction) {
        const id = req.user.id;

        try {
            const userRes = await db.query.user.findFirst({
                where: eq(user.id, id)
            });
            if (!userRes) {
                return next(CustomErrorHandler.notFound('User not found'));
            }

            await db.delete(emailOtp).where(eq(emailOtp.user_id, id));

            await emailOtpService({ id, email: userRes.email }, res, next);

            res.status(201).send(
                ResponseHandler(201, 'Verification OTP sent on your email'),
            );
        } catch (error) {
            return next(error);
        }
    },

    async resetPassword(req: any, res: Response, next: NextFunction) {
        const email = req.body.email;

        try {
            const userRes = await db.query.user.findFirst({
                where: eq(user.email, email)
            })
            if (!userRes) {
                return next(CustomErrorHandler.notFound('User not found'));
            }

            await db.delete(emailOtp).where(eq(emailOtp.user_id, userRes.id));


            await emailOtpService({ id: userRes.id, email }, res, next);

            res.status(201).send(
                ResponseHandler(201, 'Verification OTP sent on your email'),
            );
        } catch (error) {
            return next(error);
        }
    },
};

export default emailVerification;
