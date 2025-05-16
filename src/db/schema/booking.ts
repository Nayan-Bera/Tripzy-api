import { relations } from 'drizzle-orm';
import {
    pgTable,
    timestamp,
    uuid,
    varchar,
    integer
} from 'drizzle-orm/pg-core';
import properties from './properties';
import reviews from './review';
import payments from './payments';
import coupons from './coupons';
import user from './user';
import rooms from './rooms';
 const bookings = pgTable('bookings', {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    userId: uuid('user_id')
        .references(() => user.id, {
            onDelete: 'cascade',
            onUpdate: 'no action',
        })
        .notNull(),
    propertyId: uuid('property_id')
        .references(() => properties.id, {
            onDelete: 'cascade',
            onUpdate: 'no action',
        })
        .notNull(),
    roomId: uuid('room_id')
        .references(() => rooms.id, {
            onDelete: 'cascade',
            onUpdate: 'no action',
        })
        .notNull(),
    bookingType: varchar('booking_type', {
        enum: ['hourly', 'daily', 'custom'],
    }).notNull(),
    checkInDate: timestamp('check_in_date', { mode: 'string' }).notNull(),
    checkOutDate: timestamp('check_out_date', { mode: 'string' }).notNull(),
    hoursBooked: integer('hours_booked'),
    daysBooked: integer('days_booked'),
    guestCount: integer('guest_count').notNull(),
    basePrice: integer('base_price').notNull(),
    taxAmount: integer('tax_amount').notNull(),
    discountAmount: integer('discount_amount').default(0),
    totalAmount: integer('total_amount').notNull(),
    status: varchar('status', {
        enum: ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show'],
    }).default('pending'),
    paymentStatus: varchar('payment_status', {
        enum: ['pending', 'partial', 'paid', 'refunded', 'failed'],
    }).default('pending'),
    cancellationReason: varchar('cancellation_reason'),
    specialRequests: varchar('special_requests'),
    couponId: uuid('coupon_id').references(() => coupons.id),
    createdAt: timestamp('created_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
});

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
    user: one(user, {
        fields: [bookings.userId],
        references: [user.id],
    }),
    property: one(properties, {
        fields: [bookings.propertyId],
        references: [properties.id],
    }),
    room: one(rooms, {
        fields: [bookings.roomId],
        references: [rooms.id],
    }),
    payments: many(payments),
    reviews: one(reviews),
    coupon: one(coupons, {
        fields: [bookings.couponId],
        references: [coupons.id],
    }),
}));
export default bookings;