import { Router } from "express";
import { bookingController } from "../../controller";
import { protect } from "../../middleware/auth.middleware";

const router = Router();

router.get("/", protect, bookingController.getMyBookings);
router.post("/", protect, bookingController.createBooking);
router.get("/:id", protect, bookingController.getBookingDetails);
router.put("/:id/cancel", protect, bookingController.cancelBooking);

export default router;
