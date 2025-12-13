import { RequestHandler } from "express";
import { otps, users } from "../../../db/schema";
import db from "../../../db";
import { eq } from "drizzle-orm";
import ResponseHandler from "../../../utils/responseHandealer";
import CustomErrorHandler from "../../../Services/customErrorHandaler";
import emailOtpService from "../../../Services/emailOtpService";

export const verifyOtp: RequestHandler = async (req: any, res, next) => {
  const { otp } = req.body;
  const id = req.user.id;

  try {
    const isExist = await db.query.otps.findMany({
      where: eq(otps.userId, id),
    });

    if (isExist.length === 0) {
      res.status(401).json({ msg: 'Please login or register the account' });
      return;
    }

    const expires = Number(isExist[0].expiresAt);

    if (expires < Date.now()) {
      await db.delete(otps).where(eq(otps.userId, id));
      res.status(401).json({ msg: 'Generated OTP is expired, resend now' });
      return;
    }

    if (isExist[0]?.code !== otp) {
      res.status(401).json({ msg: 'Invalid OTP check your inbox' });
      return;
    }

    const [updatedUser] = await db
      .update(users)
      .set({ email_verified: true })
      .where(eq(users.id, id))
      .returning({
        email_verified: users.email_verified,
      });

    await db.delete(otps).where(eq(otps.id, isExist[0].id));

    res.status(201).send(
      ResponseHandler(201, 'Email verified successfuly', {
        email_verified: updatedUser?.email_verified,
      })
    );
    return;
  } catch (error) {
    return next(error);
  }
};

/**
 * RESEND OTP
 */
export const resendOtp: RequestHandler = async (req: any, res, next) => {
  const id = req.user.id;

  try {
    const userRes = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!userRes) {
      return next(CustomErrorHandler.notFound('User not found'));
    }

    await db.delete(otps).where(eq(otps.userId, id));

    await emailOtpService({ id, email: userRes.email }, res, next);

    res.status(201).send(
      ResponseHandler(201, 'Verification OTP sent on your email')
    );
    return;
  } catch (error) {
    return next(error);
  }
};

/**
 * RESET PASSWORD (SEND OTP)
 */
export const resetPassword: RequestHandler = async (req, res, next) => {
  const { email } = req.body;

  try {
    const userRes = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!userRes) {
      return next(CustomErrorHandler.notFound('User not found'));
    }

    await db.delete(otps).where(eq(otps.userId, userRes.id));

    await emailOtpService({ id: userRes.id, email }, res, next);

    res.status(201).send(
      ResponseHandler(201, 'Verification OTP sent on your email')
    );
    return;
  } catch (error) {
    return next(error);
  }
};
