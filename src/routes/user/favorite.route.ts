import { Router } from "express";
import { favoriteController } from "../../controller";
import { protect } from "../../middleware/auth.middleware";

const router = Router();

router.get("/", protect, favoriteController.getMyFavorites);
router.post("/", protect, favoriteController.addFavorite);
router.delete("/:propertyId", protect, favoriteController.removeFavorite);

export default router;
