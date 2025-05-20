import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';
import { config } from '../../config';
import { registerSchema } from '../../validators/auth.validator';
import { refreshToken, user } from '../../db/schema';
import CustomErrorHandler from '../../Services/customErrorHandaler';
import db from '../../db';
import JwtService from '../../Services/jwtService';
import OtpService from '../../Services/emailOtpService';
import ResponseHandler from '../../utils/responseHandealer';


const registerController = {
    async userRegister(req: Request, res: Response, next: NextFunction) {
        try {
            const { error } = registerSchema.validate(req.body);
            if (error) {
                return next(error);
            }

            const exist = await db.query.user.findFirst({
                where: eq(user.email, req.body.email),
            });

            if (exist) {
                return next(
                    CustomErrorHandler.alreadyExist(
                        'This email address has already been used',
                    ),
                );
            }
            if (
                req.body.role === 'admin || ADMIN' ||
                req.body.role === 'superAdmin || SUPER_ADMIN'
            ) {
                return next(
                    CustomErrorHandler.alreadyExist(
                        'You are not allowed to create an account',
                    ),
                );
            }
       
            const { fullname, email, password, role, phone_number }: any = req.body;

            const hashedPassword = await bcrypt.hash(password, Number(config.SALT));

            const [saveUser] = await db
                .insert(user)
                .values({
                    fullname,
                    email,
                    password: hashedPassword,
                    role,
                    phone_number,
                })
                .returning({
                    id: user.id,
                    fullname: user.fullname,
                    email: user.email,
                    role: user.role,
                    email_verified: user.email_verified,
                });

       // Send OTP after successful registration
         OtpService({ id: saveUser.id, email: saveUser.email }, res, next);

            const access_token = JwtService.sign({
                id: saveUser.id,
                role: saveUser.role,
            });

            const refresh_token = JwtService.sign(
                { id: saveUser.id, role: saveUser.role },
                '1y',
                config.REFRESH_SECRET,
            );

            await db.insert(refreshToken).values({
                token: refresh_token,
            });

           

            res.status(201).send(
                ResponseHandler(201, 'success', {
                    name: saveUser.fullname,
                    email: saveUser.email,
                    email_verified: saveUser.email_verified,
                    role: saveUser?.role,
                    access_token,
                    refresh_token,
                }),
            );
        } catch (error) {
            next(error);
        }
    },
};

export default registerController;
