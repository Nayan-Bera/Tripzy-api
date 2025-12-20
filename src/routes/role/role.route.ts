import { Router } from 'express';
import { roleController } from '../../controller';
const router = Router();
router.get('/get-role', roleController.getRole);
router.post('/add-role', roleController.addrole);
router.put('/role/:id', roleController.updateRole);
export default router;
