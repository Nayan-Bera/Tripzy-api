import db from '../db';
import { notifications } from '../db/schema/notifications';
import { eq } from 'drizzle-orm';

export const createNotification = async (userId: string, type: string, message: string, data?: object) => {
    try {
        const notification = await db.insert(notifications).values({
            userId,
            type,
            message,
            data: data || {},
            isRead: false
        }).returning();

        return notification[0];
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};

export const markNotificationAsRead = async (notificationId: string) => {
    try {
        const notification = await db.update(notifications)
            .set({
                isRead: true,
                updatedAt: new Date()
            })
            .where(eq(notifications.id, notificationId))
            .returning();

        return notification[0];
    } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error;
    }
};

export const getUserNotifications = async (userId: string) => {
    try {
        const userNotifications = await db.query.notifications.findMany({
            where: eq(notifications.userId, userId),
            orderBy: (notifications, { desc }) => [desc(notifications.createdAt)]
        });

        return userNotifications;
    } catch (error) {
        console.error('Error getting user notifications:', error);
        throw error;
    }
}; 