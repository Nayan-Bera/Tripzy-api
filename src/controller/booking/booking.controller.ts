import { Request, Response, NextFunction } from "express";
import db from "../../db";
import { bookings, digitalVerification, rooms, payments, coupons } from "../../db/schema";
import ResponseHandler from "../../utils/responseHandealer";
import { and, eq, gt } from "drizzle-orm";

export const bookingController = {
  async createBooking(req: any, res: Response, next: NextFunction) {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).send(ResponseHandler(401, "User not authenticated"));
    }
    const {
      roomId,
      checkInDate,
      checkOutDate,
      bookingType,
      hours,
      guestCount,
      specialRequests,
      couponId
    } = req.body;

    try {
      // Check if user is verified
      const verification = await db.query.digitalVerification.findFirst({
        where: and(
          eq(digitalVerification.userId, userId),
          eq(digitalVerification.status, "verified"),
          gt(digitalVerification.expiryDate, new Date().toISOString())
        )
      });

      if (!verification) {
        return res.status(403).send(ResponseHandler(403, "Please complete digital verification first"));
      }

      // Get room details
      const room = await db.query.rooms.findFirst({
        where: eq(rooms.id, roomId)
      });

      if (!room) {
        return res.status(404).send(ResponseHandler(404, "Room not found"));
      }

      // Calculate booking duration and price
      let basePrice = 0;
      let hours_booked = 0;
      let days_booked = 0;

      if (bookingType === 'hourly') {
        if (!room.isHourlyBookingEnabled) {
          return res.status(400).send(ResponseHandler(400, "Hourly booking not available for this room"));
        }
        const minHours = room.minHoursBooking ?? 1;
        const maxHours = room.maxHoursBooking ?? 24;
        if (hours < minHours || hours > maxHours) {
          return res.status(400).send(ResponseHandler(400, `Booking hours must be between ${minHours} and ${maxHours}`));
        }
        basePrice = room.pricePerHour * hours;
        hours_booked = hours;
      } else if (bookingType === 'daily') {
        const days = Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24));
        basePrice = room.pricePerDay * days;
        days_booked = days;
      } else {
        const totalHours = Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60));
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

      // Apply coupon if provided
      let couponDiscount = 0;
      if (couponId) {
        const coupon = await db.select().from(coupons).where(and(
          eq(coupons.id, couponId),
          gt(coupons.endDate, new Date().toISOString())
        )).limit(1);

        if (coupon[0]) {
          couponDiscount = Math.min(
            coupon[0].maxDiscountAmount ?? 0,
            Math.round(basePrice * (coupon[0].discountValue / 100))
          );
        }
      }

      const taxAmount = Math.round(basePrice * 0.18); // 18% tax
      const totalAmount = basePrice + taxAmount - couponDiscount;

      // Check if room is available for the requested period
      const existingBooking = await db.query.bookings.findFirst({
        where: and(
          eq(bookings.roomId, roomId),
          eq(bookings.status, "confirmed"),
          gt(bookings.checkOutDate, new Date(checkInDate).toISOString())
        )
      });

      if (existingBooking) {
        return res.status(400).send(ResponseHandler(400, "Room is not available for the selected period"));
      }

      // Create booking
      const [booking] = await db.insert(bookings).values({
        roomId,
        userId,
        propertyId: room.propertyId,
        bookingType,
        checkInDate: new Date(checkInDate).toISOString(),
        checkOutDate: new Date(checkOutDate).toISOString(),
        hoursBooked: hours_booked,
        daysBooked: days_booked,
        guestCount,
        basePrice,
        taxAmount,
        discountAmount: couponDiscount,
        totalAmount,
        status: 'pending',
        specialRequests,
        couponId
      }).returning();

      // Create initial payment record
      await db.insert(payments).values({
        userId,
        bookingId: booking.id,
        amount: totalAmount,
        status: 'pending',
        paymentMethod: 'pay_at_hotel'
      });

      res.status(201).send(ResponseHandler(201, "Booking created", booking));
    } catch (err) {
      next(err);
    }
  },

  async getBookingDetails(req: any, res: Response, next: NextFunction) {
    const { id } = req.params;
    const userId = req.user?.id;

    try {
      const booking = await db.query.bookings.findFirst({
        where: and(
          eq(bookings.id, id),
          eq(bookings.userId, userId)
        ),
        with: {
          room: {
            with: {
              property: true,
              roomImages: true
            }
          },
          payments: true,
          reviews: true
        }
      });

      if (!booking) {
        return res.status(404).send(ResponseHandler(404, "Booking not found"));
      }

      res.status(200).send(ResponseHandler(200, "Booking details fetched", booking));
    } catch (err) {
      next(err);
    }
  },

  async updateBookingStatus(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const [booking] = await db.update(bookings)
        .set({ 
          status,
          updatedAt: new Date().toISOString()
        })
        .where(eq(bookings.id, id))
        .returning();

      res.status(200).send(ResponseHandler(200, "Booking status updated", booking));
    } catch (err) {
      next(err);
    }
  }
};

export default bookingController; 