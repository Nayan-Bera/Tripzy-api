// src/routes/admin.routes.ts
import { Router } from "express";
import adminGuard from "../../../middleware/adminGuard";
import {  adminHotelController } from "../../../controller";



const router = Router();

router.post("/create", adminGuard, adminHotelController.createHotel);
router.get("/all", adminGuard, adminHotelController.getAllHotel);
router.put("/verify/:id", adminGuard, adminHotelController.updateVerifyHotel);

export default router;
