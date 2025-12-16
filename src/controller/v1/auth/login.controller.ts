// src/controller/v1/auth/login.controller.ts
import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { config } from '../../../config';
import db from '../../../db';
import { refreshTokens, users } from '../../../db/schema';
import CustomErrorHandler from '../../../Services/customErrorHandaler';
import ResponseHandler from '../../../utils/responseHandealer';
import loginSchema from '../../../validators/auth/login.validator';
import { ILogin } from '../../../@types/auth.types';
import JwtService from '../../../Services/jwtService';

export const userLogin: RequestHandler = async (req, res, next) => {
    try {
        // const { error } = loginSchema.validate(req.body);
        // if (error) return next(error);

        const { email, password }: ILogin = req.body;

        const userResult = await db.query.users.findFirst({
            where: eq(users?.email, email),
        });

        if (!userResult) {
            return next(
                CustomErrorHandler.notFound('Invalid username & password'),
            );
        }

        const matchPassword = await bcrypt.compare(
            password,
            userResult?.password,
        );
        if (!matchPassword) {
            return next(CustomErrorHandler.wrongCredentials());
        }

        const access_token = JwtService.sign({
            id: userResult.id,
            role: userResult.role,
        });
        const refresh_token = JwtService.sign(
            { id: userResult.id, role: userResult.role },
            '1y',
            config.REFRESH_SECRET,
        );

        await db.insert(refreshTokens).values({ token: refresh_token });

        // send response (do NOT return the Response object)
        res.status(200).send(
            ResponseHandler(200, 'success', {
                name: userResult.name,
                email: userResult.email,
                email_verified: userResult.email_verified,
                role: userResult.role,
                access_token,
                refresh_token,
            }),
        );
        return; // ensure Promise<void>
    } catch (error) {
        return next(error);
    }
};


