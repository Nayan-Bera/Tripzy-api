import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';
import { config } from '../../../config';
import db from '../../../db';
import { refreshTokens, users } from '../../../db/schema';
import CustomErrorHandler from '../../../Services/customErrorHandaler';
import emailOtpService from '../../../Services/emailOtpService';
import JwtService from '../../../Services/jwtService';
import ResponseHandler from '../../../utils/responseHandealer';
import registerSchema from '../../../validators/auth/register.validator';

 
const registerController = {
    async userRegister(req: Request, res: Response, next: NextFunction) {
        try {
            const { error } = registerSchema.validate(req.body);
            if (error) {
                return next(error);
            }

            const exist = await db.query.users.findFirst({
                where: eq(users.email, req.body.email),
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
       
            const { name, email, password, role, phone_number }: any = req.body;

            const hashedPassword = await bcrypt.hash(
                password,
                Number(config.SALT),
            );

            const [saveUser] = await db
                .insert(users)
                .values({
                    name,
                    email,
                    password: hashedPassword,
                    role,
                    phone_number,
                    // avatar:cloudnaryResponse?.url || ''
                })
                .returning({
                    id: users.id,
                    fullname: users.name,
                    email: users.email,
                    role: users.role,
                    email_verified: users.email_verified,
                });

            emailOtpService({ id: saveUser.id, email: saveUser.email }, res, next);

            const access_token = JwtService.sign({
                id: saveUser.id,
                role: saveUser.role,
            });

            const refresh_token = JwtService.sign(
                { id: saveUser.id, role: saveUser.role },
                '1y',
                config.REFRESH_SECRET,
            );

            await db.insert(refreshTokens).values({
                token: refresh_token,
            });

            return res.status(201).send(
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
         
            return next(error);
        }
    },
};

export default registerController;
