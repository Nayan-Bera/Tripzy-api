import { Request, Response, NextFunction } from "express";
import db from "../db";
import { digitalVerification } from "../db/schema";
import ResponseHandler from "../utils/responseHandealer";
import { eq, and, gt } from "drizzle-orm";

export const verificationController = {
  async initiateVerification(req: Request, res: Response, next: NextFunction) {
    const userId = req.user.id;
    const { verificationType, verificationData } = req.body;

    try {
      const verification = await db.insert(digitalVerification).values({
        userId,
        verificationType,
        verificationData,
        status: "pending",
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days validity
      }).returning();

      res.status(201).send(ResponseHandler(201, "Verification initiated", verification));
    } catch (err) {
      next(err);
    }
  },

  async getVerificationStatus(req: Request, res: Response, next: NextFunction) {
    const userId = req.user.id;

    try {
      const status = await db.query.digitalVerification.findFirst({
        where: eq(digitalVerification.userId, userId),
        orderBy: digitalVerification.createdAt,
      });

      res.status(200).send(ResponseHandler(200, "Verification status fetched", status));
    } catch (err) {
      next(err);
    }
  },

  async updateVerification(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    try {
      const updated = await db.update(digitalVerification)
        .set({ 
          status, 
          rejectionReason, 
          updatedAt: new Date().toISOString() 
        })
        .where(eq(digitalVerification.id, id))
        .returning();

      res.status(200).send(ResponseHandler(200, "Verification updated", updated));
    } catch (err) {
      next(err);
    }
  }
};

export default verificationController; 