// src/controllers/provider/getProviderHotels.controller.ts
import { RequestHandler } from "express";
import { eq } from "drizzle-orm";
import { hotels, hotelUsers } from "../../../../db/schema";
import db from "../../../../db";
import CustomErrorHandler from "../../../../Services/customErrorHandaler";



export const getProviderHotels: RequestHandler = async (req, res, next) => {
  try {
    const userId = req?.user?.id;
  console.log(userId);
    if (!userId) {
      return next(CustomErrorHandler.unAuthorized('User not found'));
    }

    /* Fetch hotels where user has access */
    const access = await db.query.hotelUsers.findMany({
      where: eq(hotelUsers.userId, userId),
      with: {
        hotel: {
          columns: {
            id: true,
            name: true,
            contact: true,
            verified: true,
            status: true,
          },
          with: {
            properties: {
              columns: {
                id: true,
                country: true,
                state: true,
                city: true,
              },
              with: {
                rooms: {
                  columns: { id: true },
                },
                bookings: {
                  columns: { id: true },
                },
              },
            },
          },
        },
      },
    });

    /* Format response */
    const result = access.map((item) => {
      const hotel = item.hotel;

      // If no property yet
      const primaryProperty = hotel.properties[0];

      const totalRooms = hotel.properties.reduce(
        (sum, p) => sum + p.rooms.length,
        0
      );

      const totalBookings = hotel.properties.reduce(
        (sum, p) => sum + p.bookings.length,
        0
      );

      return {
        id: hotel.id,
        name: hotel.name,
        contact: hotel.contact,
        verified: hotel.verified,
        status: hotel.status,

        country: primaryProperty?.country ?? "-",
        state: primaryProperty?.state ?? "-",
        city: primaryProperty?.city ?? "-",

        totalRooms,
        totalBookings,
      };
    });

    res.status(200).json({
      message: "Provider hotels fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("Provider hotels error:", error);
    next(error);
  }
};
export const UpdateHotelStatus: RequestHandler = async (req, res, next) => {
  try {
    const hotelId = req.params.id;
    const status = req.body.status;

    await db
      .update(hotels)
      .set({ status })
      .where(eq(hotels.id, hotelId))
      .returning();

    res.status(200).json({ message: "Hotel status updated successfully" });
  } catch (error) {
    next(error);
  }
};