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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserNotifications = exports.markNotificationAsRead = exports.createNotification = void 0;
const db_1 = __importDefault(require("../db"));
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../db/schema");
const createNotification = (userId, message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notification = yield db_1.default.insert(schema_1.notifications).values({
            userId,
            message,
        }).returning();
        return notification[0];
    }
    catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
});
exports.createNotification = createNotification;
const markNotificationAsRead = (notificationId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notification = yield db_1.default.update(schema_1.notifications)
            .set({
            isRead: true,
        })
            .where((0, drizzle_orm_1.eq)(schema_1.notifications.id, notificationId))
            .returning();
        return notification[0];
    }
    catch (error) {
        console.error('Error marking notification as read:', error);
        throw error;
    }
});
exports.markNotificationAsRead = markNotificationAsRead;
const getUserNotifications = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userNotifications = yield db_1.default.query.notifications.findMany({
            where: (0, drizzle_orm_1.eq)(schema_1.notifications.userId, userId),
            orderBy: (notifications, { desc }) => [desc(notifications.createdAt)]
        });
        return userNotifications;
    }
    catch (error) {
        console.error('Error getting user notifications:', error);
        throw error;
    }
});
exports.getUserNotifications = getUserNotifications;
