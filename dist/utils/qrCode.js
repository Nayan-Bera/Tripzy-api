"use strict";
// import QRCode from 'qrcode';
// import db from '../db';
// import { eq } from 'drizzle-orm';
// import { bookings } from '../db/schema';
// interface QRCodeData {
//     bookingId: string;
//     userId: string;
//     checkIn: string;
//     checkOut: string;
//     roomId: string;
//     propertyId: string;
// }
// interface QRCodeInfo {
//     code: string;
//     generatedAt: Date;
//     scannedAt: Date | null;
// }
// export const generateQRCode = async (bookingId: string): Promise<string> => {
//     try {
//         const booking = await db.query.bookings.findFirst({
//             where: eq(bookings.id, bookingId)
//         });
//         if (!booking) {
//             throw new Error('Booking not found');
//         }
//         const qrData: QRCodeData = {
//             bookingId: booking.id,
//             userId: booking.userId,
//             checkIn: booking.checkIn.toISOString(),
//             checkOut: booking.checkOut.toISOString(),
//             roomId: booking.roomId,
//             propertyId: booking.propertyId
//         };
//         // Generate QR code as data URL
//         const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
//             errorCorrectionLevel: 'H',
//             margin: 1,
//             width: 300
//         });
//         // Update booking with QR code data
//         const qrCodeInfo: QRCodeInfo = {
//             code: qrCodeDataUrl,
//             generatedAt: new Date(),
//             scannedAt: null
//         };
//         await db.update(bookings)
//             .set({
//                 qrCode: qrCodeInfo
//             })
//             .where(eq(bookings.id, bookingId));
//         return qrCodeDataUrl;
//     } catch (error) {
//         console.error('Error generating QR code:', error);
//         throw error;
//     }
// };
// export const validateQRCode = async (qrCodeData: string): Promise<{
//     isValid: boolean;
//     booking?: any;
//     error?: string;
// }> => {
//     try {
//         const data: QRCodeData = JSON.parse(qrCodeData);
//         const booking = await db.query.bookings.findFirst({
//             where: eq(bookings.id, data.bookingId),
//             with: {
//                 user: true,
//                 room: true,
//                 property: true
//             }
//         });
//         if (!booking) {
//             return { isValid: false, error: 'Booking not found' };
//         }
//         // Check if booking is in valid state for check-in
//         if (booking.status !== 'confirmed') {
//             return { 
//                 isValid: false, 
//                 error: `Booking is not in valid state for check-in. Current status: ${booking.status}` 
//             };
//         }
//         // Check if check-in date is valid
//         const now = new Date();
//         const checkInDate = new Date(booking.checkIn);
//         const checkOutDate = new Date(booking.checkOut);
//         if (now < checkInDate) {
//             return { 
//                 isValid: false, 
//                 error: 'Check-in date has not arrived yet' 
//             };
//         }
//         if (now > checkOutDate) {
//             return { 
//                 isValid: false, 
//                 error: 'Check-out date has passed' 
//             };
//         }
//         return { isValid: true, booking };
//     } catch (error) {
//         console.error('Error validating QR code:', error);
//         return { isValid: false, error: 'Invalid QR code' };
//     }
// };
// export const markQRCodeAsScanned = async (bookingId: string): Promise<void> => {
//     try {
//         const qrCodeInfo: QRCodeInfo = {
//             code: '',
//             generatedAt: new Date(),
//             scannedAt: new Date()
//         };
//         await db.update(bookings)
//             .set({
//                 qrCode: qrCodeInfo
//             })
//             .where(eq(bookings.id, bookingId));
//     } catch (error) {
//         console.error('Error marking QR code as scanned:', error);
//         throw error;
//     }
// }; 
