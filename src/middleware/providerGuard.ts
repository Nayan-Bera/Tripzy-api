import { RequestHandler } from "express";

const providerGuard: RequestHandler = (req, res, next) => {
  if (!req.user?.id) {
    res.sendStatus(401);
    return;
  }

  // Admins always allowed
  if (
    req?.user?.platformRole === "admin" ||
    req?.user?.platformRole === "super_admin"
  ) {
   next();
   return;
  }

  // Normal users → validated later via hotel_users
  next();
  return;
};

export default providerGuard;
