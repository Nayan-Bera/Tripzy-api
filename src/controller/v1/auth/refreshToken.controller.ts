// src/controller/v1/auth/refreshToken.controller.ts
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
    next(error);
    return;
  }

  try {
    const refreshTokenDocument = await db.query.refreshTokens.findFirst({
      where: eq(refreshTokenDb.token, req.body.refresh_token),
    });

    if (!refreshTokenDocument || !refreshTokenDocument.token) {
      next(CustomErrorHandler.unAuthorized('Invalid refresh token'));
      return;
    }

    let userId: string;
    try {
      const { id } = (await JwtService.verify(
        refreshTokenDocument.token,
        config.REFRESH_SECRET
      )) as JwtPayload;
      userId = id;
    } catch (err) {
      next(CustomErrorHandler.unAuthorized('Invalid refresh token'));
      return;
    }

    const userRes = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!userRes) {
      next(CustomErrorHandler.unAuthorized('No user found!'));
      return;
    }

    const access_token = JwtService.sign({
      id: userRes.id,
      role: userRes.role,
    });
    const refresh_token = JwtService.sign(
      { id: userRes.id, role: userRes.role },
      '1y',
      config.REFRESH_SECRET
    );

    await db
      .update(refreshTokenDb)
      .set({ token: refresh_token })
      .where(eq(refreshTokenDb.token, req.body.refresh_token));

    res.json({ access_token, refresh_token });
    return;
  } catch (err) {
    next(new Error('Something went wrong'));
    return;
  }
};


