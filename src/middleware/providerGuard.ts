import { RequestHandler } from "express";

const providerGuard: RequestHandler = (req, res, next) => {
  if (!req.user?.id) {
    res.sendStatus(401);
  }

  // Admins always allowed
  if (
    req?.user?.platformRole === "admin" ||
    req?.user?.platformRole === "super_admin"
  ) {
   next();
  }

  // Normal users → validated later via hotel_users
  next();
};

export default providerGuard;
