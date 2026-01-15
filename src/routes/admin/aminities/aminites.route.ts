// src/routes/admin.routes.ts
import { Router } from 'express';
import adminGuard from '../../../middleware/adminGuard';
import { aminitiesController } from '../../../controller';

const router = Router();

router.get('/all', aminitiesController.getAllAmenities);
router.post('/create',adminGuard, aminitiesController.addAminities);

export default router;
