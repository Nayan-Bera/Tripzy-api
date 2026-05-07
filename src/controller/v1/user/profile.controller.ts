import { eq } from "drizzle-orm";
import { RequestHandler } from "express";
import db from "../../../db";
import { users } from "../../../db/schema";

export const getMe: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user!.id;

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        id: true,
        name: true,
        email: true,
        platformRole: true,
        status: true,
        email_verified: true,
        phone_number: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      message: "Profile fetched successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMe: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { name, phone_number, avatar } = req.body;

    const [user] = await db
      .update(users)
      .set({
        ...(name !== undefined ? { name } : {}),
        ...(phone_number !== undefined ? { phone_number } : {}),
        ...(avatar !== undefined ? { avatar } : {}),
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        platformRole: users.platformRole,
        status: users.status,
        email_verified: users.email_verified,
        phone_number: users.phone_number,
        avatar: users.avatar,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    res.status(200).json({
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
