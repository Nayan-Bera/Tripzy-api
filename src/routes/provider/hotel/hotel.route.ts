// src/routes/provider.routes.ts
import { Router } from "express";
import providerGuard from "../../../middleware/providerGuard";
import { providerHotelController } from "../../../controller";

const router = Router();

router.get("/hotels", providerGuard,providerHotelController.getProviderHotels );

export default router;
