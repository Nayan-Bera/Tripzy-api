import { bookingController } from '../controller';
import express, { RequestHandler } from 'express';
import auth from '../middleware/auth';

const router = express.Router();

router.post('/bookings', auth, bookingController.createBooking as RequestHandler);
router.get('/bookings/:id', auth, bookingController.getBookingDetails as RequestHandler);
router.put('/bookings/:id/status', auth, bookingController.updateBookingStatus as RequestHandler);

export default router;
