import { RequestHandler } from "express";
import JwtService from "../Services/jwtService";

const adminGuard: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.sendStatus(401);
    return;
  }

  try {
    const token = authHeader.split(" ")[1];
    const payload = JwtService.verify(token);

    if (
      payload.platformRole !== "admin" &&
      payload.platformRole !== "super_admin"
    ) {
      res.sendStatus(403);
      return;
    }

    // ✅ attach user to request
    req.user = payload;

    next();
  } catch {
    res.sendStatus(401);
  }
};

export default adminGuard;
