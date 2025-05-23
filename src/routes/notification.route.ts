import express from 'express';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// TODO: Add notification routes
// Example:
// router.get('/', authenticate, getUserNotifications);
// router.put('/:id/read', authenticate, markNotificationAsRead);
// router.put('/read-all', authenticate, markAllNotificationsAsRead);
// router.delete('/:id', authenticate, deleteNotification);

export default router; 