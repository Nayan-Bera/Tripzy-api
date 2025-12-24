import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { RequestHandler } from 'express';
import { config } from '../../../config';
import db from '../../../db';
import { refreshTokens, users } from '../../../db/schema';
import CustomErrorHandler from '../../../Services/customErrorHandaler';
import emailOtpService from '../../../Services/emailOtpService';
import JwtService from '../../../Services/jwtService';
import ResponseHandler from '../../../utils/responseHandealer';

export const userRegister: RequestHandler = async (req, res, next) => {
  try {
    const { name, email, password, phone_number } = req.body;

    // 1️⃣ Check existing user
    const exist = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (exist) {
      return next(
        CustomErrorHandler.alreadyExist(
          'This email address has already been used'
        )
      );
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      Number(config.SALT)
    );

    // 3️⃣ Create user (platformRole defaults to USER)
    const [saveUser] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        phone_number,
        // platformRole: 'USER' → default
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        platformRole: users.platformRole,
        email_verified: users.email_verified,
      });

    // 4️⃣ Send email OTP
    emailOtpService(
      { id: saveUser.id, email: saveUser.email },
      res,
      next
    );

    // 5️⃣ Generate tokens (PLATFORM ROLE ONLY)
    const access_token = JwtService.sign({
      id: saveUser.id,
      platformRole: saveUser.platformRole,
    });

    const refresh_token = JwtService.sign(
      {
        id: saveUser.id,
        platformRole: saveUser.platformRole,
      },
      '1y',
      config.REFRESH_SECRET
    );

    await db.insert(refreshTokens).values({
      token: refresh_token,
      userId: saveUser.id,
    });

    // 6️⃣ Response
    res.status(201).json(
      ResponseHandler(201, 'success', {
        user: {
          id: saveUser.id,
          name: saveUser.name,
          email: saveUser.email,
          platformRole: saveUser.platformRole,
          email_verified: saveUser.email_verified,
        },
        access_token,
        refresh_token,
      })
    );
  } catch (error) {
    next(error);
  }
};
