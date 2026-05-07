import { NextFunction, Request, Response } from "express";

export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!allowedRoles.includes(req.user.platformRole)) {
      return res.status(403).json({
        message: "Access denied",
        requiredRoles: allowedRoles,
        currentRole: req.user.platformRole,
      });
    }

    next();
  };
};
