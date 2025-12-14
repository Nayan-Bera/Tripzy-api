import { Router } from "express";
import { otpController } from "../../controller";
import { protect } from "../../middleware/auth.middleware";


const router =Router();

router.post('/verify-otp',otpController.verifyOtp);
router.post('/resend-otp', otpController.resendOtp);
router.post('/reset-password',otpController.resetPassword);

export default router