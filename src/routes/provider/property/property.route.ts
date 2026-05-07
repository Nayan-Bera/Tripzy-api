import { Router } from "express";
import { providerPropertyController } from "../../../controller";
import { protect } from "../../../middleware/auth.middleware";
import providerGuard from "../../../middleware/providerGuard";

const router = Router();

router.get("/hotels/:hotelId/properties", protect, providerGuard, providerPropertyController.getHotelProperties);
router.post("/hotels/:hotelId/properties", protect, providerGuard, providerPropertyController.createProperty);
router.put("/properties/:propertyId", protect, providerGuard, providerPropertyController.updateProperty);
router.delete("/properties/:propertyId", protect, providerGuard, providerPropertyController.deleteProperty);
router.post("/properties/:propertyId/rooms", protect, providerGuard, providerPropertyController.createRoom);
router.put("/rooms/:roomId", protect, providerGuard, providerPropertyController.updateRoom);
router.delete("/rooms/:roomId", protect, providerGuard, providerPropertyController.deleteRoom);

export default router;
