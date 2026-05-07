import { Router } from "express";
import { profileController } from "../../controller";
import { protect } from "../../middleware/auth.middleware";

const router = Router();

router.get("/me", protect, profileController.getMe);
router.put("/me", protect, profileController.updateMe);

export default router;
