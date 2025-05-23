import { Request, Response, NextFunction } from 'express';
import db from '../../../db';
import {
  bookings,
  digitalVerification,
  rooms,
  payments,
  coupons,
} from '../../../db/schema';
import { and, eq, gt } from 'drizzle-orm';
import CustomErrorHandler from '../../../Services/customErrorHandaler';
import ResponseHandler from '../../../utils/responseHandealer';
import { IUserRequestBody } from '../../../@types/user.types';

interface AuthenticatedRequest extends Request {
  user: IUserRequestBody;
}

const bookingController = {
  async createBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const userId = req.user?.id;
    if (!userId) {
      next(CustomErrorHandler.unAuthorized());
      return;
    }

    const {
      roomId,
      checkInDate,
      checkOutDate,
      bookingType,
      hours,
      guestCount,
      specialRequests,
      couponId,
    } = req.body;

    try {
      const verification = await db.query.digitalVerification.findFirst({
        where: and(
          eq(digitalVerification.userId, userId),
          eq(digitalVerification.status, 'verified'),
          gt(digitalVerification.expiryDate, new Date().toISOString())
        ),
      });

      if (!verification) {
        return next(
          CustomErrorHandler.notFound('Please complete digital verification first')
        );
      }

      const room = await db.query.rooms.findFirst({
        where: eq(rooms.id, roomId),
      });

      if (!room) return next(CustomErrorHandler.notFound('Room not found'));

      let basePrice = 0;
      let hours_booked = 0;
      let days_booked = 0;

      if (bookingType === 'hourly') {
        if (!room.isHourlyBookingEnabled) {
          return next(
            CustomErrorHandler.invalid('Hourly booking not available for this room')
          );
        }

        const minHours = room.minHoursBooking ?? 1;
        const maxHours = room.maxHoursBooking ?? 24;

        if (hours < minHours || hours > maxHours) {
          return next(
            CustomErrorHandler.invalid(
              `Booking hours must be between ${minHours} and ${maxHours}`
            )
          );
        }

        basePrice = room.pricePerHour * hours;
        hours_booked = hours;
      } else if (bookingType === 'daily') {
        const days =
          Math.ceil(
            (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) /
              (1000 * 60 * 60 * 24)
          ) || 1;
        basePrice = room.pricePerDay * days;
        days_booked = days;
      } else {
        const totalHours =
          Math.ceil(
            (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) /
              (1000 * 60 * 60)
          ) || 1;
        const days = Math.floor(totalHours / 24);
        const remainingHours = totalHours % 24;

        basePrice = days * room.pricePerDay + remainingHours * room.pricePerHour;
        days_booked = days;
        hours_booked = remainingHours;
      }

      if (room.discount) {
        basePrice -= Math.round(basePrice * (room.discount / 100));
      }

      let couponDiscount = 0;
      if (couponId) {
        const coupon = await db
          .select()
          .from(coupons)
          .where(
            and(
              eq(coupons.id, couponId),
              gt(coupons.endDate, new Date().toISOString())
            )
          )
          .limit(1);

        if (coupon[0]) {
          couponDiscount = Math.min(
            coupon[0].maxDiscountAmount ?? 0,
            Math.round(basePrice * (coupon[0].discountValue / 100))
          );
        }
      }

      const taxAmount = Math.round(basePrice * 0.18);
      const totalAmount = basePrice + taxAmount - couponDiscount;

      const existingBooking = await db.query.bookings.findFirst({
        where: and(
          eq(bookings.roomId, roomId),
          eq(bookings.status, 'confirmed'),
          gt(bookings.checkOutDate, new Date(checkInDate).toISOString())
        ),
      });

      if (existingBooking) {
        return next(
          CustomErrorHandler.notFound('Room is not available for the selected period')
        );
      }

      const [booking] = await db
        .insert(bookings)
        .values({
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
          couponId,
        })
        .returning();

      await db.insert(payments).values({
        userId,
        bookingId: booking.id,
        amount: totalAmount,
        status: 'pending',
        paymentMethod: 'pay_at_hotel',
      });

      res
        .status(201)
        .send(ResponseHandler(201, 'Booking created successfully', booking));
    } catch (error) {
      next(error);
    }
  },

  async getBookingDetails(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const userId = req.user?.id;
    const { id } = req.params;
    if (!userId) {
      next(CustomErrorHandler.unAuthorized());
      return;
    }

    try {
      const booking = await db.query.bookings.findFirst({
        where: and(eq(bookings.id, id), eq(bookings.userId, userId)),
        with: {
          room: {
            with: {
              property: true,
              roomImages: true,
            },
          },
          payments: true,
          reviews: true,
        },
      });

      if (!booking) return next(CustomErrorHandler.notFound('Booking not found'));

      res
        .status(200)
        .send(ResponseHandler(200, 'Booking details fetched', booking));
    } catch (error) {
      next(error);
    }
  },

  async updateBookingStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const [updated] = await db
        .update(bookings)
        .set({ status, updatedAt: new Date().toISOString() })
        .where(eq(bookings.id, id))
        .returning();

      res
        .status(200)
        .send(ResponseHandler(200, 'Booking status updated', updated));
    } catch (error) {
      next(error);
    }
  },

  async getUserBookings(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const userId = req.user?.id;
    if (!userId) {
      next(CustomErrorHandler.unAuthorized());
      return;
    }

    try {
      const bookingsList = await db.query.bookings.findMany({
        where: eq(bookings.userId, userId),
      });

      res
        .status(200)
        .send(ResponseHandler(200, 'Bookings fetched successfully', bookingsList));
    } catch (error) {
      next(error);
    }
  },

  async cancelBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) return next(CustomErrorHandler.unAuthorized());

    try {
      const [cancelled] = await db
        .update(bookings)
        .set({ status: 'cancelled' })
        .where(and(eq(bookings.id, id), eq(bookings.userId, userId)))
        .returning();

      return res
        .status(200)
        .send(ResponseHandler(200, 'Booking cancelled successfully', cancelled));
    } catch (error) {
      next(error);
    }
  },
};

export default bookingController;
