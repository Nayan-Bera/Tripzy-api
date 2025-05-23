import { Request, Response, NextFunction } from 'express';
import db from '../../../db';
import {
  bookings,
  digitalVerification,
  rooms,
  payments,
  coupons,
  identityVerification,
} from '../../../db/schema';
import { and, eq, gt, desc, gte, lte, or } from 'drizzle-orm';
import CustomErrorHandler from '../../../Services/customErrorHandaler';
import ResponseHandler from '../../../utils/responseHandealer';
import { IUserRequestBody } from '../../../@types/user.types';
import { AuthenticatedRequest } from '../../../types/express';

interface AuthenticatedRequest extends Request {
  user?: IUserRequestBody;
}

interface Booking {
  id: string;
  userId: string;
  propertyId: string;
  roomId: string;
  bookingType: 'hourly' | 'daily' | 'custom';
  checkInDate: string;
  checkOutDate: string;
  hoursBooked: number;
  daysBooked: number;
  guestCount: number;
  basePrice: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show';
  paymentStatus: 'pending' | 'partial' | 'paid' | 'refunded' | 'failed';
  specialRequests?: string;
  couponId?: string;
  createdAt: string;
  updatedAt: string;
}

const bookingController = {
  async createBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return next(CustomErrorHandler.unAuthorized());
      }

      const {
        propertyId,
        roomId,
        checkInDate,
        checkOutDate,
        guestCount,
        bookingType,
        hoursBooked,
        daysBooked,
        paymentMethod,
        specialRequests,
        couponId,
      } = req.body;

      // Check if user has verified identity
      const [verification] = await db
        .select()
        .from(identityVerification)
        .where(
          and(
            eq(identityVerification.userId, userId),
            eq(identityVerification.verificationStatus, 'verified')
          )
        );

      if (!verification) {
        return next(
          CustomErrorHandler.notFound('Please complete identity verification first')
        );
      }

      // Check room availability
      const [room] = await db
        .select()
        .from(rooms)
        .where(eq(rooms.id, roomId));

      if (!room) {
        return next(CustomErrorHandler.notFound('Room not found'));
      }

      // Check for overlapping bookings
      const overlappingBookings = await db
        .select()
        .from(bookings)
        .where(
          and(
            eq(bookings.roomId, roomId),
            eq(bookings.status, 'confirmed'),
            or(
              and(
                gte(bookings.checkInDate, checkInDate),
                lte(bookings.checkInDate, checkOutDate)
              ),
              and(
                gte(bookings.checkOutDate, checkInDate),
                lte(bookings.checkOutDate, checkOutDate)
              )
            )
          )
        );

      if (overlappingBookings.length > 0) {
        return next(
          CustomErrorHandler.invalid('Room is not available for selected dates')
        );
      }

      // Calculate prices
      const basePrice = bookingType === 'hourly' 
        ? room.pricePerHour * hoursBooked 
        : room.pricePerDay * daysBooked;
      const taxAmount = Math.round(basePrice * 0.18); // 18% GST
      const discountAmount = 0; // Calculate based on coupon if provided
      const totalAmount = basePrice + taxAmount - discountAmount;

      // Create booking
      const [newBooking] = await db
        .insert(bookings)
        .values({
          userId,
          propertyId,
          roomId,
          bookingType,
          checkInDate,
          checkOutDate,
          hoursBooked,
          daysBooked,
          guestCount,
          basePrice,
          taxAmount,
          discountAmount,
          totalAmount,
          specialRequests,
          couponId,
          status: 'pending',
          paymentStatus: 'pending',
        })
        .returning();

      // Create payment record
      const [payment] = await db
        .insert(payments)
        .values({
          bookingId: newBooking.id,
          userId,
          amount: totalAmount,
          paymentMethod,
          status: 'pending',
        })
        .returning();

      res.status(201).json({
        message: 'Booking created successfully',
        data: {
          booking: newBooking,
          payment,
          verification: {
            qrCode: verification.qrCode,
            documentType: verification.documentType,
          }
        },
      });
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
        with: {
          room: {
            with: {
              property: true,
              roomImages: true
            }
          },
          payments: true
        },
        orderBy: [desc(bookings.createdAt)]
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
    if (!userId) {
      next(CustomErrorHandler.unAuthorized());
      return;
    }

    try {
      const booking = await db.query.bookings.findFirst({
        where: and(
          eq(bookings.id, id),
          eq(bookings.userId, userId)
        )
      });

      if (!booking) {
        next(CustomErrorHandler.notFound('Booking not found'));
        return;
      }

      if (booking.status === 'cancelled') {
        next(CustomErrorHandler.invalid('Booking is already cancelled'));
        return;
      }

      if (booking.status === 'checked_out') {
        next(CustomErrorHandler.invalid('Cannot cancel a checked out booking'));
        return;
      }

      const [cancelled] = await db
        .update(bookings)
        .set({ 
          status: 'cancelled',
          updatedAt: new Date().toISOString()
        })
        .where(and(
          eq(bookings.id, id),
          eq(bookings.userId, userId)
        ))
        .returning();

      // Update payment status if exists
      await db
        .update(payments)
        .set({ 
          status: 'refunded',
          updatedAt: new Date().toISOString()
        })
        .where(eq(payments.bookingId, id));

      res
        .status(200)
        .send(ResponseHandler(200, 'Booking cancelled successfully', cancelled));
    } catch (error) {
      next(error);
    }
  },

  async getBookingStats(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const userId = req.user?.id;
    if (!userId) {
      next(CustomErrorHandler.unAuthorized());
      return;
    }

    try {
      const totalBookings = await db.query.bookings.findMany({
        where: eq(bookings.userId, userId)
      });

      const stats = {
        total: totalBookings.length,
        pending: totalBookings.filter(b => b.status === 'pending').length,
        confirmed: totalBookings.filter(b => b.status === 'confirmed').length,
        checked_in: totalBookings.filter(b => b.status === 'checked_in').length,
        checked_out: totalBookings.filter(b => b.status === 'checked_out').length,
        cancelled: totalBookings.filter(b => b.status === 'cancelled').length,
        no_show: totalBookings.filter(b => b.status === 'no_show').length
      };

      res
        .status(200)
        .send(ResponseHandler(200, 'Booking stats fetched successfully', stats));
    } catch (error) {
      next(error);
    }
  }
};

export default bookingController;
