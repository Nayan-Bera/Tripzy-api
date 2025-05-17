import { Request, Response, NextFunction } from "express";
import db from "../db";
import { rooms, roomImages, bookings } from "../db/schema";
import ResponseHandler from "../utils/responseHandealer";
import { and, eq, gt, lt, lte, gte, or, not, inArray } from "drizzle-orm";

export const roomController = {
  async checkAvailability(req: Request, res: Response, next: NextFunction) {
    const { propertyId, startDate, endDate, bookingType, hours } = req.body;

    try {
      // Get all rooms for the property
      const propertyRooms = await db.query.rooms.findMany({
        where: eq(rooms.propertyId, propertyId),
        with: {
          bookings: {
            where: and(
              not(inArray(bookings.status, ['cancelled', 'no_show'])),
              or(
                and(
                  lte(bookings.checkInDate, new Date(startDate).toISOString()),
                  gte(bookings.checkOutDate, new Date(startDate).toISOString())
                ),
                and(
                  lte(bookings.checkInDate, new Date(endDate).toISOString()),
                  gte(bookings.checkOutDate, new Date(endDate).toISOString())
                )
              )
            )
          },
          roomImages: true
        }
      });

      // Filter available rooms
      const availableRooms = propertyRooms.filter(room => !room.bookings?.length);

      res.status(200).send(ResponseHandler(200, "Available rooms fetched", availableRooms));
    } catch (err) {
      next(err);
    }
  },

  async getRoomDetails(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      const room = await db.query.rooms.findFirst({
        where: eq(rooms.id, id),
        with: {
          roomImages: true,
          property: true
        }
      });

      if (!room) {
        return res.status(404).send(ResponseHandler(404, "Room not found"));
      }

      res.status(200).send(ResponseHandler(200, "Room details fetched", room));
    } catch (err) {
      next(err);
    }
  },

  async calculatePrice(req: Request, res: Response, next: NextFunction) {
    const { roomId, bookingType, startDate, endDate, hours } = req.body;

    try {
      const room = await db.query.rooms.findFirst({
        where: eq(rooms.id, roomId)
      });

      if (!room) {
        return res.status(404).send(ResponseHandler(404, "Room not found"));
      }

      let basePrice = 0;
      let hours_booked = 0;
      let days_booked = 0;

      if (bookingType === 'hourly') {
        basePrice = room.pricePerHour * hours;
        hours_booked = hours;
      } else if (bookingType === 'daily') {
        const days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
        basePrice = room.pricePerDay * days;
        days_booked = days;
      } else {
        const totalHours = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60));
        const days = Math.floor(totalHours / 24);
        const remainingHours = totalHours % 24;
        
        basePrice = (days * room.pricePerDay) + (remainingHours * room.pricePerHour);
        days_booked = days;
        hours_booked = remainingHours;
      }

      // Apply room discount if any
      if (room.discount) {
        const discountAmount = Math.round(basePrice * (room.discount / 100));
        basePrice -= discountAmount;
      }

      const taxAmount = Math.round(basePrice * 0.18); // 18% tax
      const totalAmount = basePrice + taxAmount;

      res.status(200).send(ResponseHandler(200, "Price calculated", {
        basePrice,
        taxAmount,
        totalAmount,
        hours_booked,
        days_booked
      }));
    } catch (err) {
      next(err);
    }
  }
};

export default roomController; 