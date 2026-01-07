import { RequestHandler } from "express";
import JwtService from "../Services/jwtService";

/**
 * Provider Guard
 * Allows:
 *  - Admin / Super Admin
 *  - Users who have provider access granted by admin
 */
const providerGuard: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.sendStatus(401);
    return;
  }

  try {
    const token = authHeader.split(" ")[1];
    const payload = JwtService.verify(token);

    //  Allow admins always
    if (
      payload.platformRole === "admin" ||
      payload.platformRole === "super_admin"
    ) {
      req.user = payload;
      next();
      return;
    }

    // For normal users, provider access is checked later (hotel_users)
    req.user = payload;
    next();
  } catch {
    res.sendStatus(401);
  }
};

export default providerGuard;
