import { and, desc, eq } from "drizzle-orm";
import { RequestHandler } from "express";
import db from "../../../db";
import { properties, reviews } from "../../../db/schema";

export const getPropertyReviews: RequestHandler = async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    const data = await db.query.reviews.findMany({
      where: eq(reviews.propertyId, propertyId),
      orderBy: [desc(reviews.createdAt)],
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "Reviews fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const createReview: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { propertyId } = req.params;
    const { rating, comment } = req.body;
    const ratingValue = Number(rating);

    if (!Number.isInteger(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      res.status(400).json({ message: "Rating must be an integer from 1 to 5" });
      return;
    }

    if (!comment) {
      res.status(400).json({ message: "Comment is required" });
      return;
    }

    const property = await db.query.properties.findFirst({
      where: eq(properties.id, propertyId),
    });

    if (!property) {
      res.status(404).json({ message: "Property not found" });
      return;
    }

    const existing = await db.query.reviews.findFirst({
      where: and(eq(reviews.userId, userId), eq(reviews.propertyId, propertyId)),
    });

    if (existing) {
      const [updated] = await db
        .update(reviews)
        .set({
          rating: ratingValue,
          comment,
          createdAt: new Date(),
        })
        .where(eq(reviews.id, existing.id))
        .returning();

      res.status(200).json({
        message: "Review updated successfully",
        data: updated,
      });
      return;
    }

    const [review] = await db
      .insert(reviews)
      .values({
        userId,
        propertyId,
        rating: ratingValue,
        comment,
      })
      .returning();

    res.status(201).json({
      message: "Review created successfully",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReview: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    await db.delete(reviews).where(and(eq(reviews.id, id), eq(reviews.userId, userId)));

    res.status(200).json({
      message: "Review deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
