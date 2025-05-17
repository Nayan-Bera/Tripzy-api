import { Router } from 'express';
import userController from '../controller/user.controller';

const router = Router();
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', userController.getProfile);
router.put('/profile',  userController.editProfile);
router.get('/bookings',  userController.getBookings);
router.post('/favorites',  userController.addToFavorites);
router.post('/apply-coupon',  userController.applyCoupon);

export default router;
