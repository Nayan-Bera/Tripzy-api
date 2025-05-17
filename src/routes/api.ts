import { Router } from 'express';
import userController from '../controller/user.controller';
import verificationController from '../controller/verification.controller';
import roomController from '../controller/room.controller';
import bookingController from '../controller/booking.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// User routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', authenticateToken, userController.getProfile);
router.put('/profile', authenticateToken, userController.editProfile);
router.get('/bookings', authenticateToken, userController.getBookings);
router.post('/favorites', authenticateToken, userController.addToFavorites);
router.post('/apply-coupon', authenticateToken, userController.applyCoupon);

// Digital Verification routes
router.post('/verification/initiate', authenticateToken, verificationController.initiateVerification);
router.get('/verification/status', authenticateToken, verificationController.getVerificationStatus);
router.put('/verification/:id', authenticateToken, verificationController.updateVerification);

// Room routes
router.post('/rooms/check-availability', roomController.checkAvailability);
router.get('/rooms/:id', roomController.getRoomDetails);
router.post('/rooms/calculate-price', roomController.calculatePrice);

// Booking routes
router.post('/bookings', authenticateToken, bookingController.createBooking);
router.get('/bookings/:id', authenticateToken, bookingController.getBookingDetails);
router.put('/bookings/:id/status', authenticateToken, bookingController.updateBookingStatus);

export default router; 