import { Router } from 'express';
import userController from '../controller/user.controller';
import verificationController from '../controller/verification.controller';
import roomController from '../controller/room.controller';
import bookingController from '../controller/booking.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();



// Digital Verification routes
router.post('/verification/initiate', authenticateToken, verificationController.initiateVerification);
router.get('/verification/status', authenticateToken, verificationController.getVerificationStatus);
router.put('/verification/:id', authenticateToken, verificationController.updateVerification);

// Room routes
router.post('/rooms/check-availability', roomController.checkAvailability);
router.get('/rooms/:id', roomController.getRoomDetails);
router.post('/rooms/calculate-price', roomController.calculatePrice);

export default router;