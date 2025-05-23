import { Request, Response } from 'express';
import db from '../../../db';
import identityVerification from '../../../db/schema/identityVerification';
import user from '../../../db/schema/user';
import { eq } from 'drizzle-orm';
import { generateQRCode } from '../../../utils/qrCode';
import { AuthenticatedRequest } from '../../../types/express';

export const uploadIdentityDocuments = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { documentType, documentNumber, documentImages } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (!documentImages || !Array.isArray(documentImages)) {
            return res.status(400).json({ message: 'No document images provided' });
        }

        // Generate QR code
        const qrCode = await generateQRCode(userId);

        // Create identity verification record
        const [verification] = await db
            .insert(identityVerification)
            .values({
                userId,
                documentType,
                documentNumber,
                documentImages,
                qrCode,
            })
            .returning();

        res.status(201).json({
            message: 'Identity documents uploaded successfully',
            data: verification,
        });
    } catch (error) {
        console.error('Error uploading identity documents:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const verifyIdentity = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { verificationId } = req.params;
        const { status, notes } = req.body;
        const verifierId = req.user?.id;

        if (!verifierId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const [verification] = await db
            .update(identityVerification)
            .set({
                verificationStatus: status,
                verificationNotes: notes,
                verifiedBy: verifierId,
                verifiedAt: new Date().toISOString(),
            })
            .where(eq(identityVerification.id, verificationId))
            .returning();

        if (!verification) {
            return res.status(404).json({ message: 'Verification record not found' });
        }

        res.json({
            message: 'Identity verification updated successfully',
            data: verification,
        });
    } catch (error) {
        console.error('Error verifying identity:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const scanQRCode = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { qrCode } = req.params;
        const hotelId = req.user?.id;

        if (!hotelId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const [verification] = await db
            .select()
            .from(identityVerification)
            .where(eq(identityVerification.qrCode, qrCode));

        if (!verification) {
            return res.status(404).json({ message: 'Invalid QR code' });
        }

        // Get user details
        const [userDetails] = await db
            .select()
            .from(user)
            .where(eq(user.id, verification.userId));

        res.json({
            message: 'QR code scanned successfully',
            data: {
                user: {
                    id: userDetails.id,
                    fullname: userDetails.fullname,
                    email: userDetails.email,
                    phone_number: userDetails.phone_number,
                },
                verification: {
                    documentType: verification.documentType,
                    documentNumber: verification.documentNumber,
                    documentImages: verification.documentImages,
                    verificationStatus: verification.verificationStatus,
                },
            },
        });
    } catch (error) {
        console.error('Error scanning QR code:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getVerificationStatus = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const [verification] = await db
            .select()
            .from(identityVerification)
            .where(eq(identityVerification.userId, userId));

        if (!verification) {
            return res.status(404).json({ message: 'No verification record found' });
        }

        res.json({
            message: 'Verification status retrieved successfully',
            data: verification,
        });
    } catch (error) {
        console.error('Error getting verification status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}; 