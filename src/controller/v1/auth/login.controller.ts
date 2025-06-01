import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import db from '../../../db';
import loginSchema from '../../../validators/auth/login.validator';
import { ILogin } from '../../../@types/auth.types';
import { refreshTokens, users } from '../../../db/schema';
import CustomErrorHandler from '../../../Services/customErrorHandaler';
import JwtService from '../../../Services/jwtService';
import ResponseHandler from '../../../utils/responseHandealer';
import { config } from '../../../config';


const loginController = {
    async userLogin(req: Request, res: Response, next: NextFunction) {
        try {
            const { error } = loginSchema.validate(req.body);
            if (error) {
                return next(error);
            }

            const { email, password }: ILogin = req.body;

            const userResult = await db.query.users.findFirst({
                where: eq(users?.email, email),
            });
         
            if (!userResult) {
                return next(
                    CustomErrorHandler.notFound('Invalid username & password'),
                );
            }

            // if (userResult.status !== UserStatus.ACTIVE) {
            //     return next(
            //         CustomErrorHandler.notAllowed(
            //             `User account is ${userResult.status}`,
            //         ),
            //     );
            // }

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
        } catch (error) {
            return next(error);
        }
    },
};

export default loginController;
