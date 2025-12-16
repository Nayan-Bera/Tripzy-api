import { Router } from "express";
import { loginController, logoutController, refreshTokenController, registerController } from "../../controller";


const router =Router();

router.post('/login',loginController.userLogin);
router.post('/logout',logoutController.logout);
router.post('/refreshToken',refreshTokenController.refresh);
router.post('/register',registerController.userRegister);
router.post('/refresh',refreshTokenController.refresh);

export default router