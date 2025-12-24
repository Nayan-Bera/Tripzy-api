import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { RequestHandler } from 'express';
import { ILogin } from '../../../@types/auth.types';
import { config } from '../../../config';
import db from '../../../db';
import { refreshTokens, users, hotelUsers, hotels, role } from '../../../db/schema';
import CustomErrorHandler from '../../../Services/customErrorHandaler';
import JwtService from '../../../Services/jwtService';
import ResponseHandler from '../../../utils/responseHandealer';

export const userLogin: RequestHandler = async (req, res, next) => {
  try {
    const { email, password }: ILogin = req.body;

    // 1️⃣ Find user
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return next(CustomErrorHandler.wrongCredentials());
    }

    // 2️⃣ Check password
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return next(CustomErrorHandler.wrongCredentials());
    }

    if (user.status !== 'active') {
      return next(CustomErrorHandler.unAuthorized('Account is inactive'));
    }

    // 3️⃣ Fetch hotel access (if any)
    const hotelAccess = await db.query.hotelUsers.findMany({
      where: eq(hotelUsers.userId, user.id),
      with: {
        hotel: {
          columns: {
            id: true,
            name: true,
          },
        },
        role: {
          columns: {
            name: true,
          },
        },
      },
    });

    // 4️⃣ Generate tokens (PLATFORM ROLE ONLY)
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

    await db.insert(refreshTokens).values({
      token: refresh_token,
      userId: user.id,
    });

    // 5️⃣ Response
    res.status(200).json(
      ResponseHandler(200, 'success', {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          platformRole: user.platformRole,
          email_verified: user.email_verified,
        },
        hotelAccess: hotelAccess.map((ha) => ({
          hotelId: ha.hotel.id,
          hotelName: ha.hotel.name,
          role: ha.role.name,
        })),
        access_token,
        refresh_token,
      })
    );
  } catch (error) {
    next(error);
  }
};
