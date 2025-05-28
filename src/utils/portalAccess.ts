import { db } from '../db';
import { users, properties } from '../db/schema';
import { eq } from 'drizzle-orm';
import { createNotification } from './notification';

interface PortalAccess {
    userId: string;
    portalType: 'admin' | 'hotel_owner' | 'customer';
    permissions: string[];
    isActive: boolean;
    lastAccessed?: Date;
}

export const grantPortalAccess = async (
    userId: string,
    portalType: 'admin' | 'hotel_owner' | 'customer',
    permissions: string[]
): Promise<void> => {
    try {
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId)
        });

        if (!user) {
            throw new Error('User not found');
        }

        // Update user's portal access
        await db.update(users)
            .set({
                portalAccess: {
                    type: portalType,
                    permissions,
                    isActive: true,
                    lastAccessed: new Date()
                },
                updatedAt: new Date()
            })
            .where(eq(users.id, userId));

        // Notify user
        await createNotification({
            userId,
            type: 'portal_access_granted',
            title: 'Portal Access Granted',
            message: `You have been granted access to the ${portalType} portal`,
            data: { portalType, permissions }
        });
    } catch (error) {
        console.error('Error granting portal access:', error);
        throw error;
    }
};

export const revokePortalAccess = async (userId: string): Promise<void> => {
    try {
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId)
        });

        if (!user) {
            throw new Error('User not found');
        }

        // Remove portal access
        await db.update(users)
            .set({
                portalAccess: null,
                updatedAt: new Date()
            })
            .where(eq(users.id, userId));

        // Notify user
        await createNotification({
            userId,
            type: 'portal_access_revoked',
            title: 'Portal Access Revoked',
            message: 'Your portal access has been revoked',
            data: { userId }
        });
    } catch (error) {
        console.error('Error revoking portal access:', error);
        throw error;
    }
};

export const updatePortalPermissions = async (
    userId: string,
    permissions: string[]
): Promise<void> => {
    try {
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId)
        });

        if (!user || !user.portalAccess) {
            throw new Error('User not found or has no portal access');
        }

        // Update permissions
        await db.update(users)
            .set({
                portalAccess: {
                    ...user.portalAccess,
                    permissions,
                    updatedAt: new Date()
                },
                updatedAt: new Date()
            })
            .where(eq(users.id, userId));

        // Notify user
        await createNotification({
            userId,
            type: 'portal_permissions_updated',
            title: 'Portal Permissions Updated',
            message: 'Your portal permissions have been updated',
            data: { permissions }
        });
    } catch (error) {
        console.error('Error updating portal permissions:', error);
        throw error;
    }
};

export const validatePortalAccess = async (
    userId: string,
    requiredPermission: string
): Promise<boolean> => {
    try {
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId)
        });

        if (!user || !user.portalAccess) {
            return false;
        }

        const { permissions, isActive } = user.portalAccess;

        if (!isActive) {
            return false;
        }

        return permissions.includes(requiredPermission);
    } catch (error) {
        console.error('Error validating portal access:', error);
        return false;
    }
};

export const trackPortalAccess = async (userId: string): Promise<void> => {
    try {
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId)
        });

        if (!user || !user.portalAccess) {
            throw new Error('User not found or has no portal access');
        }

        // Update last accessed timestamp
        await db.update(users)
            .set({
                portalAccess: {
                    ...user.portalAccess,
                    lastAccessed: new Date()
                },
                updatedAt: new Date()
            })
            .where(eq(users.id, userId));
    } catch (error) {
        console.error('Error tracking portal access:', error);
        throw error;
    }
}; 