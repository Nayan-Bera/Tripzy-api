// src/routes/provider.routes.ts
import { Router } from 'express';
import providerGuard from '../../../middleware/providerGuard';
import { providerHotelController } from '../../../controller';
import { protect } from '../../../middleware/auth.middleware';
import { uploadMultiple } from '../../../middleware/upload';
import { submitHotelForVerification } from '../../../controller/v1/provider/hotel/uploadHotelDocument.controller';

const router = Router();

router.get(
    '/my-hotels',
    protect,
    providerGuard,
    providerHotelController.getProviderHotels,
);
router.put(
    '/updateStatus/:id',
    protect,
    providerGuard,
    providerHotelController.UpdateHotelStatus,
);
router.post(
    '/:hotelId/submit-verification',
    protect,
    uploadMultiple,
    submitHotelForVerification,
);

export default router;
