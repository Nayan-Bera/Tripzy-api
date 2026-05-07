import { Router } from "express";
import { reviewController } from "../../controller";
import { protect } from "../../middleware/auth.middleware";

const router = Router();

router.get("/properties/:propertyId/reviews", reviewController.getPropertyReviews);
router.post("/properties/:propertyId/reviews", protect, reviewController.createReview);
router.delete("/reviews/:id", protect, reviewController.deleteReview);

export default router;
