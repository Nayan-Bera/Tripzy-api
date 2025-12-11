// src/controller/v1/auth/logout.controller.ts
import { RequestHandler } from 'express';
import { eq } from 'drizzle-orm';
import Joi from 'joi';
import db from '../../../db';
import { refreshTokens } from '../../../db/schema';

const logoutSchema = Joi.object({
  refresh_token: Joi.string().required(),
});

export const logout: RequestHandler = async (req, res, next) => {
  const { error } = logoutSchema.validate(req.body);
  if (error) {
    next(error);
    return;
  }

  try {
    await db.delete(refreshTokens).where(eq(refreshTokens.token, req.body.refresh_token));
    res.json({ status: 1 });
    return;
  } catch (err) {
    next(new Error('Something went wrong in the database'));
    return;
  }
};

