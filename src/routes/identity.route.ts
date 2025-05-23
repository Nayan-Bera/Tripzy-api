import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
    uploadIdentityDocuments,
    verifyIdentity,
    scanQRCode,
    getVerificationStatus,
} from '../controller/v1/identity/identity.controller';

const router = Router();

// Customer routes
router.post('/upload', authenticate, uploadIdentityDocuments);
router.get('/status', authenticate, getVerificationStatus);

// Hotel staff routes
router.post('/verify/:verificationId', authenticate, verifyIdentity);
router.get('/scan/:qrCode', authenticate, scanQRCode);

export default router; 