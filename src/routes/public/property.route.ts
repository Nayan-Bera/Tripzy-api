import { Router } from "express";
import { publicPropertyController } from "../../controller";

const router = Router();

router.get("/properties", publicPropertyController.listProperties);
router.get("/properties/:id", publicPropertyController.getPropertyDetails);
router.get("/hotels/:id", publicPropertyController.getHotelDetails);

export default router;
