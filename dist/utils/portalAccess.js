"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackPortalAccess = exports.validatePortalAccess = exports.updatePortalPermissions = exports.revokePortalAccess = exports.grantPortalAccess = void 0;
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const notification_1 = require("./notification");
const grantPortalAccess = (userId, portalType, permissions) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db_1.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.users.id, userId)
        });
        if (!user) {
            throw new Error('User not found');
        }
        // Update user's portal access
        yield db_1.db.update(schema_1.users)
            .set({
            portalAccess: {
                type: portalType,
                permissions,
                isActive: true,
                lastAccessed: new Date()
            },
            updatedAt: new Date()
        })
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, userId));
        // Notify user
        yield (0, notification_1.createNotification)({
            userId,
            type: 'portal_access_granted',
            title: 'Portal Access Granted',
            message: `You have been granted access to the ${portalType} portal`,
            data: { portalType, permissions }
        });
    }
    catch (error) {
        console.error('Error granting portal access:', error);
        throw error;
    }
});
exports.grantPortalAccess = grantPortalAccess;
const revokePortalAccess = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db_1.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.users.id, userId)
        });
        if (!user) {
            throw new Error('User not found');
        }
        // Remove portal access
        yield db_1.db.update(schema_1.users)
            .set({
            portalAccess: null,
            updatedAt: new Date()
        })
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, userId));
        // Notify user
        yield (0, notification_1.createNotification)({
            userId,
            type: 'portal_access_revoked',
            title: 'Portal Access Revoked',
            message: 'Your portal access has been revoked',
            data: { userId }
        });
    }
    catch (error) {
        console.error('Error revoking portal access:', error);
        throw error;
    }
});
exports.revokePortalAccess = revokePortalAccess;
const updatePortalPermissions = (userId, permissions) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db_1.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.users.id, userId)
        });
        if (!user || !user.portalAccess) {
            throw new Error('User not found or has no portal access');
        }
        // Update permissions
        yield db_1.db.update(schema_1.users)
            .set({
            portalAccess: Object.assign(Object.assign({}, user.portalAccess), { permissions, updatedAt: new Date() }),
            updatedAt: new Date()
        })
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, userId));
        // Notify user
        yield (0, notification_1.createNotification)({
            userId,
            type: 'portal_permissions_updated',
            title: 'Portal Permissions Updated',
            message: 'Your portal permissions have been updated',
            data: { permissions }
        });
    }
    catch (error) {
        console.error('Error updating portal permissions:', error);
        throw error;
    }
});
exports.updatePortalPermissions = updatePortalPermissions;
const validatePortalAccess = (userId, requiredPermission) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db_1.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.users.id, userId)
        });
        if (!user || !user.portalAccess) {
            return false;
        }
        const { permissions, isActive } = user.portalAccess;
        if (!isActive) {
            return false;
        }
        return permissions.includes(requiredPermission);
    }
    catch (error) {
        console.error('Error validating portal access:', error);
        return false;
    }
});
exports.validatePortalAccess = validatePortalAccess;
const trackPortalAccess = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db_1.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.users.id, userId)
        });
        if (!user || !user.portalAccess) {
            throw new Error('User not found or has no portal access');
        }
        // Update last accessed timestamp
        yield db_1.db.update(schema_1.users)
            .set({
            portalAccess: Object.assign(Object.assign({}, user.portalAccess), { lastAccessed: new Date() }),
            updatedAt: new Date()
        })
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, userId));
    }
    catch (error) {
        console.error('Error tracking portal access:', error);
        throw error;
    }
});
exports.trackPortalAccess = trackPortalAccess;
