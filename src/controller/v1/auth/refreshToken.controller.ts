import { RequestHandler } from 'express';
import { eq } from 'drizzle-orm';
import Joi from 'joi';
import { JwtPayload } from 'jsonwebtoken';
import { config } from '../../../config';
import db from '../../../db';
import { refreshTokens as refreshTokenDb, users } from '../../../db/schema';
import CustomErrorHandler from '../../../Services/customErrorHandaler';
import JwtService from '../../../Services/jwtService';

const refreshSchema = Joi.object({
  refresh_token: Joi.string().required(),
});

export const refresh: RequestHandler = async (req, res, next) => {
  const { error } = refreshSchema.validate(req.body);
  if (error) {
    return next(error);
  }

  try {
    // 1️⃣ Check refresh token exists in DB
    const refreshTokenDocument = await db.query.refreshTokens.findFirst({
      where: eq(refreshTokenDb.token, req.body.refresh_token),
    });

    if (!refreshTokenDocument) {
      return next(
        CustomErrorHandler.unAuthorized('Invalid refresh token')
      );
    }

    // 2️⃣ Verify refresh token
    let userId: string;

    try {
      const payload = (await JwtService.verify(
        refreshTokenDocument.token,
        config.REFRESH_SECRET
      )) as JwtPayload;

      userId = payload.id as string;
    } catch {
      return next(
        CustomErrorHandler.unAuthorized('Invalid refresh token')
      );
    }

    // 3️⃣ Fetch user
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        id: true,
        platformRole: true,
        status: true,
      },
    });

    if (!user || user.status !== 'active') {
      return next(
        CustomErrorHandler.unAuthorized('User not found or inactive')
      );
    }

    // 4️⃣ Issue new tokens (PLATFORM ROLE ONLY)
    const access_token = JwtService.sign({
      id: user.id,
      platformRole: user.platformRole,
    });

    const refresh_token = JwtService.sign(
      {
        id: user.id,
        platformRole: user.platformRole,
      },
      '1y',
      config.REFRESH_SECRET
    );

    // 5️⃣ Rotate refresh token
    await db
      .update(refreshTokenDb)
      .set({ token: refresh_token })
      .where(eq(refreshTokenDb.token, req.body.refresh_token));

    // 6️⃣ Respond
    res.json({
      access_token,
      refresh_token,
    });
  } catch (err) {
    next(err);
  }
};
