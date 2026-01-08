import "express";

declare global {
  namespace Express {
    interface User {
      id: string;
      platformRole: "user" | "admin" | "super_admin";
    }

    interface Request {
      user?: User;
    }
  }
}

export {};
