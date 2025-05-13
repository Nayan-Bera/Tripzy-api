import { relations } from 'drizzle-orm';
import {
    boolean,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from 'drizzle-orm/pg-core';
import user from './user';
 const notifications = pgTable('notifications', {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    userId: uuid('user_id')
        .references(() => user.id, {
            onDelete: 'cascade',
            onUpdate: 'no action',
        })
        .notNull(),
    title: varchar('title').notNull(),
    message: varchar('message').notNull(),
    type: varchar('type', {
        enum: ['booking', 'payment', 'promotion', 'system', 'reminder', 'verification'],
    }).notNull(),
    isRead: boolean('is_read').default(false),
    resourceId: uuid('resource_id'), // Related booking/payment ID
    resourceType: varchar('resource_type', {
        enum: ['booking', 'payment', 'property', 'review', 'account'],
    }),
    createdAt: timestamp('created_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
    user: one(user, {
        fields: [notifications.userId],
        references: [user.id],
    }),
}));
export default notifications;