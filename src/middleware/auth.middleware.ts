import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import db from "../db";
import { config } from "../config";
import { users } from "../db/schema";
import { AppError } from "./error.middleware";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return next(new AppError("Please log in", 401));
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, config.ACCESS_SECRET) as {
      id: string;
      platformRole: "user" | "admin" | "super_admin";
    };

    const [user] = await db
      .select({
        id: users.id,
        platformRole: users.platformRole,
        status: users.status,
      })
      .from(users)
      .where(eq(users.id, decoded.id));

    if (!user || user.status !== "active") {
      return next(new AppError("User not found or inactive", 401));
    }

    // ✅ SAFE & TYPED
    req.user = {
      id: user.id,
      platformRole: user.platformRole,
    };

    next();
  } catch {
    next(new AppError("Invalid token", 401));
  }
};
