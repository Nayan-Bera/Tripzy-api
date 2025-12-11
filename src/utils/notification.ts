import db from '../db';
import { eq } from 'drizzle-orm';
import { notifications } from '../db/schema';

export const createNotification = async (userId: string, message: string) => {
    try {
        const notification = await db.insert(notifications).values({
            userId,
            message,
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