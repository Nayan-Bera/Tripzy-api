// src/routes/admin.routes.ts
import { Router } from "express";
import adminGuard from "../../../middleware/adminGuard";
import { adminController } from "../../../controller";



const router = Router();

router.post("/hotels", adminGuard, adminController.createHotel);

export default router;
