import express, { RequestHandler } from 'express';
import auth from '../middleware/auth';
import { userController } from '../controller';

const router = express.Router();

router.get('/profile', auth, userController.getProfile as RequestHandler);

export default router;
