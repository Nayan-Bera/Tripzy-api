import { and, eq } from "drizzle-orm";
import { RequestHandler } from "express";
import db from "../../../db";
import { favorites, properties } from "../../../db/schema";

export const getMyFavorites: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user!.id;

    const data = await db.query.favorites.findMany({
      where: eq(favorites.userId, userId),
      with: {
        property: {
          with: {
            hotel: {
              columns: {
                id: true,
                name: true,
                verified: true,
                status: true,
              },
            },
            images: {
              columns: {
                id: true,
                url: true,
              },
            },
            rooms: {
              columns: {
                id: true,
                pricePerDay: true,
                pricePerHour: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json({
      message: "Favorites fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const addFavorite: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { propertyId } = req.body;

    const property = await db.query.properties.findFirst({
      where: eq(properties.id, propertyId),
    });

    if (!property) {
      res.status(404).json({ message: "Property not found" });
      return;
    }

    const existing = await db.query.favorites.findFirst({
      where: and(eq(favorites.userId, userId), eq(favorites.propertyId, propertyId)),
    });

    if (existing) {
      res.status(200).json({
        message: "Property already in favorites",
        data: existing,
      });
      return;
    }

    const [favorite] = await db
      .insert(favorites)
      .values({ userId, propertyId })
      .returning();

    res.status(201).json({
      message: "Favorite added successfully",
      data: favorite,
    });
  } catch (error) {
    next(error);
  }
};

export const removeFavorite: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { propertyId } = req.params;

    await db
      .delete(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.propertyId, propertyId)));

    res.status(200).json({
      message: "Favorite removed successfully",
    });
  } catch (error) {
    next(error);
  }
};
