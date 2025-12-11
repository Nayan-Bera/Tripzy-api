"use strict";
// import { db } from '../db';
// import { rooms, bookings, roomAvailability } from '../db/schema';
// import { eq, and, gte, lte, sql } from 'drizzle-orm';
// import { createNotification } from './notification';
// interface AvailabilityUpdate {
//     roomId: string;
//     date: Date;
//     isAvailable: boolean;
//     price?: number;
//     currency?: string;
//     minStay?: number;
//     maxStay?: number;
//     blockedReason?: string;
// }
// export const updateRoomAvailability = async (updates: AvailabilityUpdate[]): Promise<void> => {
//     try {
//         for (const update of updates) {
//             await db.insert(roomAvailability)
//                 .values({
//                     roomId: update.roomId,
//                     date: update.date,
//                     isAvailable: update.isAvailable,
//                     price: update.price,
//                     currency: update.currency || 'inr',
//                     minStay: update.minStay,
//                     maxStay: update.maxStay,
//                     blockedReason: update.blockedReason,
//                     createdAt: new Date(),
//                     updatedAt: new Date()
//                 })
//                 .onConflictDoUpdate({
//                     target: [roomAvailability.roomId, roomAvailability.date],
//                     set: {
//                         isAvailable: update.isAvailable,
//                         price: update.price,
//                         currency: update.currency,
//                         minStay: update.minStay,
//                         maxStay: update.maxStay,
//                         blockedReason: update.blockedReason,
//                         updatedAt: new Date()
//                     }
//                 });
//         }
//     } catch (error) {
//         console.error('Error updating room availability:', error);
//         throw error;
//     }
// };
// export const checkRoomAvailability = async (
//     roomId: string,
//     checkIn: Date,
//     checkOut: Date
// ): Promise<boolean> => {
//     try {
//         const availability = await db.query.roomAvailability.findMany({
//             where: and(
//                 eq(roomAvailability.roomId, roomId),
//                 gte(roomAvailability.date, checkIn),
//                 lte(roomAvailability.date, checkOut)
//             )
//         });
//         return availability.every(day => day.isAvailable);
//     } catch (error) {
//         console.error('Error checking room availability:', error);
//         throw error;
//     }
// };
// export const getRoomAvailability = async (
//     roomId: string,
//     startDate: Date,
//     endDate: Date
// ): Promise<any[]> => {
//     try {
//         return await db.query.roomAvailability.findMany({
//             where: and(
//                 eq(roomAvailability.roomId, roomId),
//                 gte(roomAvailability.date, startDate),
//                 lte(roomAvailability.date, endDate)
//             )
//         });
//     } catch (error) {
//         console.error('Error getting room availability:', error);
//         throw error;
//     }
// };
// export const updateAvailabilityForBooking = async (
//     bookingId: string,
//     status: 'confirmed' | 'cancelled' | 'checked_out'
// ): Promise<void> => {
//     try {
//         const booking = await db.query.bookings.findFirst({
//             where: eq(bookings.id, bookingId),
//             with: {
//                 room: true
//             }
//         });
//         if (!booking) {
//             throw new Error('Booking not found');
//         }
//         const updates: AvailabilityUpdate[] = [];
//         const currentDate = new Date(booking.checkIn);
//         const endDate = new Date(booking.checkOut);
//         while (currentDate <= endDate) {
//             updates.push({
//                 roomId: booking.roomId,
//                 date: new Date(currentDate),
//                 isAvailable: status === 'cancelled' || status === 'checked_out',
//                 price: booking.room.basePrice,
//                 currency: 'inr',
//                 minStay: 1,
//                 maxStay: 30
//             });
//             currentDate.setDate(currentDate.getDate() + 1);
//         }
//         await updateRoomAvailability(updates);
//         // Notify hotel owner about availability update
//         await createNotification({
//             userId: booking.room.property.ownerId,
//             type: 'availability_updated',
//             title: 'Room Availability Updated',
//             message: `Room ${booking.room.roomNumber} availability has been updated due to booking ${status}`,
//             data: { bookingId, roomId: booking.roomId }
//         });
//     } catch (error) {
//         console.error('Error updating availability for booking:', error);
//         throw error;
//     }
// };
// export const blockRoomForMaintenance = async (
//     roomId: string,
//     startDate: Date,
//     endDate: Date,
//     reason: string
// ): Promise<void> => {
//     try {
//         const updates: AvailabilityUpdate[] = [];
//         const currentDate = new Date(startDate);
//         const lastDate = new Date(endDate);
//         while (currentDate <= lastDate) {
//             updates.push({
//                 roomId,
//                 date: new Date(currentDate),
//                 isAvailable: false,
//                 blockedReason: reason
//             });
//             currentDate.setDate(currentDate.getDate() + 1);
//         }
//         await updateRoomAvailability(updates);
//     } catch (error) {
//         console.error('Error blocking room for maintenance:', error);
//         throw error;
//     }
// };
// export const unblockRoom = async (
//     roomId: string,
//     startDate: Date,
//     endDate: Date
// ): Promise<void> => {
//     try {
//         const updates: AvailabilityUpdate[] = [];
//         const currentDate = new Date(startDate);
//         const lastDate = new Date(endDate);
//         while (currentDate <= lastDate) {
//             updates.push({
//                 roomId,
//                 date: new Date(currentDate),
//                 isAvailable: true,
//                 blockedReason: null
//             });
//             currentDate.setDate(currentDate.getDate() + 1);
//         }
//         await updateRoomAvailability(updates);
//     } catch (error) {
//         console.error('Error unblocking room:', error);
//         throw error;
//     }
// }; 
