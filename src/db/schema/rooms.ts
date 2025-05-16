import {
    jsonb,
    pgTable,
    timestamp,
    uuid,
    varchar,
    boolean,
    integer
} from 'drizzle-orm/pg-core';
import properties from './properties';
import { relations } from 'drizzle-orm';
import roomImages from './roomsImages';
import bookings from './booking';
const rooms = pgTable('rooms', {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    propertyId: uuid('property_id')
        .references(() => properties.id, {
            onDelete: 'cascade',
            onUpdate: 'no action',
        })
        .notNull(),
    name: varchar('name').notNull(),
    description: varchar('description').notNull(),
    roomType: varchar('room_type', {
        enum: ['single', 'double', 'twin', 'suite', 'deluxe', 'family'],
    }).notNull(),
    maxOccupancy: integer('max_occupancy').notNull(),
    pricePerHour: integer('price_per_hour').notNull(),
    pricePerDay: integer('price_per_day').notNull(),
    discount: integer('discount').default(0),
    amenities: jsonb('amenities').notNull(),
    status: varchar('status', {
        enum: ['available', 'booked', 'maintenance', 'inactive'],
    }).default('available'),
    totalRooms: integer('total_rooms').notNull(),
    isHourlyBookingEnabled: boolean('is_hourly_booking_enabled').default(true),
    minHoursBooking: integer('min_hours_booking').default(2),
    maxHoursBooking: integer('max_hours_booking').default(12),
    createdAt: timestamp('created_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
});

export const roomsRelations = relations(rooms, ({ one, many }) => ({
    property: one(properties, {
        fields: [rooms.propertyId],
        references: [properties.id],
    }),
    roomImages: many(roomImages),
    bookings: many(bookings),
}));
export default rooms;