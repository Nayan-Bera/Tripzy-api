import { Router } from 'express';
import bookingController from '../controller/booking.controller';


const router = Router();
router.post('/bookings',  bookingController.createBooking)
.get('/bookings/:id',  bookingController.getBookingDetails)
.put('/bookings/:id/status',  bookingController.updateBookingStatus);

export default router;
