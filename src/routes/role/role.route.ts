import { Router } from 'express';
import { roleController } from '../../controller';
const router = Router();
router.get('/role', roleController.getRole);
router.post('/role', roleController.addrole);
router.put('/role/:id', roleController.updateRole);
export default router;
