// src/routes/provider.routes.ts
import { Router } from "express";
import providerGuard from "../../../middleware/providerGuard";
import { providerHotelController } from "../../../controller";
import { protect } from "../../../middleware/auth.middleware";

const router = Router();

router.get("/my-hotels",protect, providerGuard,providerHotelController.getProviderHotels );
router.put("/updateStatus/:id",protect, providerGuard,providerHotelController.UpdateHotelStatus);

export default router;
