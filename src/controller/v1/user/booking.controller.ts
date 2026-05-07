import { and, desc, eq, inArray } from "drizzle-orm";
import { RequestHandler } from "express";
import db from "../../../db";
import {
  bookingRooms,
  bookings,
  payments,
  properties,
  rooms,
} from "../../../db/schema";

type BookingRoomInput = {
  roomId: string;
  quantity?: number;
};

function makeOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const getMyBookings: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user!.id;

    const data = await db.query.bookings.findMany({
      where: eq(bookings.userId, userId),
      orderBy: [desc(bookings.createdAt)],
      with: {
        property: {
          with: {
            hotel: {
              columns: {
                id: true,
                name: true,
                contact: true,
              },
            },
            images: {
              columns: {
                id: true,
                url: true,
              },
            },
          },
        },
        bookingRooms: {
          with: {
            room: true,
          },
        },
        payments: true,
      },
    });

    res.status(200).json({
      message: "Bookings fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getBookingDetails: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const booking = await db.query.bookings.findFirst({
      where: and(eq(bookings.id, id), eq(bookings.userId, userId)),
      with: {
        property: {
          with: {
            hotel: true,
            images: true,
          },
        },
        bookingRooms: {
          with: {
            room: {
              with: {
                images: true,
              },
            },
          },
        },
        payments: true,
      },
    });

    if (!booking) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }

    res.status(200).json({
      message: "Booking fetched successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export const createBooking: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const {
      propertyId,
      checkIn,
      checkOut,
      rooms: requestedRooms,
      paymentMethod = "card",
    } = req.body as {
      propertyId: string;
      checkIn: string;
      checkOut: string;
      rooms: BookingRoomInput[];
      paymentMethod?: "card" | "upi" | "wallet";
    };

    if (!propertyId || !checkIn || !checkOut || !Array.isArray(requestedRooms) || !requestedRooms.length) {
      res.status(400).json({
        message: "propertyId, checkIn, checkOut, and rooms are required",
      });
      return;
    }

    const property = await db.query.properties.findFirst({
      where: eq(properties.id, propertyId),
    });

    if (!property) {
      res.status(404).json({ message: "Property not found" });
      return;
    }

    const roomIds = requestedRooms.map((room) => room.roomId);
    const selectedRooms = await db.query.rooms.findMany({
      where: inArray(rooms.id, roomIds),
    });

    const invalidRoom = selectedRooms.find((room) => room.propertyId !== propertyId);
    if (selectedRooms.length !== roomIds.length || invalidRoom) {
      res.status(400).json({ message: "One or more rooms are invalid for this property" });
      return;
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime()) || checkOutDate <= checkInDate) {
      res.status(400).json({ message: "Invalid check-in/check-out dates" });
      return;
    }

    const [booking] = await db
      .insert(bookings)
      .values({
        userId,
        propertyId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        status: "pending",
        otpCode: makeOtp(),
        qrCode: `TRIPZY-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      })
      .returning();

    await db.insert(bookingRooms).values(
      requestedRooms.map((item) => ({
        bookingId: booking.id,
        roomId: item.roomId,
        quantity: item.quantity ?? 1,
      }))
    );

    const amount = selectedRooms.reduce((sum, room) => {
      const requested = requestedRooms.find((item) => item.roomId === room.id);
      return sum + Number(room.pricePerDay) * (requested?.quantity ?? 1);
    }, 0);

    const [payment] = await db
      .insert(payments)
      .values({
        bookingId: booking.id,
        amount: amount.toFixed(2),
        paymentMethod,
        status: "pending",
      })
      .returning();

    res.status(201).json({
      message: "Booking created successfully",
      data: {
        booking,
        payment,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const cancelBooking: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const [booking] = await db
      .update(bookings)
      .set({ status: "cancelled" })
      .where(and(eq(bookings.id, id), eq(bookings.userId, userId)))
      .returning();

    if (!booking) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }

    res.status(200).json({
      message: "Booking cancelled successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};
