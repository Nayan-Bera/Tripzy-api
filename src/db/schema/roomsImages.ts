import { relations } from 'drizzle-orm';
import {
    boolean,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from 'drizzle-orm/pg-core';
import rooms from './rooms';
 const roomImages = pgTable('room_images', {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    roomId: uuid('room_id')
        .references(() => rooms.id, {
            onDelete: 'cascade',
            onUpdate: 'no action',
        })
        .notNull(),
    image: varchar('image').notNull(),
    caption: varchar('caption'),
    isPrimary: boolean('is_primary').default(false),
    createdAt: timestamp('created_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
});

export const roomImagesRelations = relations(roomImages, ({ one }) => ({
    room: one(rooms, {
        fields: [roomImages.roomId],
        references: [rooms.id],
    }),
}));

export default roomImages;