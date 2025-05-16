import { relations } from 'drizzle-orm';
import {
    boolean,
    pgTable,
    timestamp,
    uuid,
    varchar,
    integer,
    jsonb
} from 'drizzle-orm/pg-core';
import rooms from './rooms';
 const roomAvailability = pgTable('room_availability', {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    roomId: uuid('room_id')
        .references(() => rooms.id, {
            onDelete: 'cascade',
            onUpdate: 'no action',
        })
        .notNull(),
    date: timestamp('date', { mode: 'string' }).notNull(),
    availableRooms: integer('available_rooms').notNull(),
    bookedRooms: integer('booked_rooms').default(0),
    hourlyAvailability: jsonb('hourly_availability'), // Store hourly slots for the day
    priceMultiplier: integer('price_multiplier').default(100), // Percentage: 100 = normal price
    isBlockedByAdmin: boolean('is_blocked_by_admin').default(false),
    blockingReason: varchar('blocking_reason'),
    createdAt: timestamp('created_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
});

export const roomAvailabilityRelations = relations(roomAvailability, ({ one }) => ({
    room: one(rooms, {
        fields: [roomAvailability.roomId],
        references: [rooms.id],
    }),
}));

export default roomAvailability;