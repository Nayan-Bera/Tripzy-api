import express, { RequestHandler } from 'express';
import auth from '../middleware/auth';
import {
    loginController,
    refreshTokenController,
    logoutController,
    forgotPasswordController,
    registerController,
} from '../controller';
// import upload from '../../services/multer';

const router = express.Router();

router.post('/login', loginController.userLogin);
router.post('/register', registerController.userRegister);
router.post('/refresh', refreshTokenController.refresh);
router.post('/logout', auth, logoutController.logout);
router.put('/forgot-password', forgotPasswordController.changePassword);
router.put('/update-password', auth, forgotPasswordController.updatePassword);

export default router;
