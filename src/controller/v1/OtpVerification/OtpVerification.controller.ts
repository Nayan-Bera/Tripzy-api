import { RequestHandler } from "express";
import { otps, users } from "../../../db/schema";
import db from "../../../db";
import { eq } from "drizzle-orm";
import ResponseHandler from "../../../utils/responseHandealer";
import CustomErrorHandler from "../../../Services/customErrorHandaler";
import emailOtpService from "../../../Services/emailOtpService";

export const verifyOtp: RequestHandler = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return next(CustomErrorHandler.wrongCredentials('Email and OTP are required'));
    }

    // 1️⃣ Find user
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return next(CustomErrorHandler.unAuthorized('User not found'));
    }

    // 2️⃣ Find OTP
    const otpRecord = await db.query.otps.findFirst({
      where: eq(otps.userId, user.id),
    });

    if (!otpRecord) {
      return next(CustomErrorHandler.unAuthorized('OTP not found or expired'));
    }

    // 3️⃣ Check expiry
    if (otpRecord.expiresAt.getTime() < Date.now()) {
      await db.delete(otps).where(eq(otps.userId, user.id));
      return next(CustomErrorHandler.unAuthorized('OTP expired, resend OTP'));
    }

    // 4️⃣ Check OTP
    if (otpRecord.code !== otp) {
      return next(CustomErrorHandler.unAuthorized('Invalid OTP'));
    }

    // 5️⃣ Verify email
    await db
      .update(users)
      .set({ email_verified: true })
      .where(eq(users.id, user.id));

    // 6️⃣ Delete OTP
    await db.delete(otps).where(eq(otps.userId, user.id));

    res.status(200).json(
      ResponseHandler(200, 'Email verified successfully', {
        email_verified: true,
      })
    );
  } catch (error) {
    next(error);
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
