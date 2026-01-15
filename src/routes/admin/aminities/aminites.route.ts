// src/routes/admin.routes.ts
import { Router } from 'express';
import adminGuard from '../../../middleware/adminGuard';
import { aminitiesController } from '../../../controller';

const router = Router();

router.post('/all', adminGuard, aminitiesController.getAllAmenities);
router.get('/create', adminGuard, aminitiesController.addAminities);

export default router;
