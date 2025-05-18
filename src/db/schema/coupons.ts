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
import userCoupons from './userCoupons';
import bookings from './booking';

 const coupons = pgTable('coupons', {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    code: varchar('code').notNull().unique(),
    title: varchar('title').notNull(),
    description: varchar('description'),
    discountType: varchar('discount_type', {
        enum: ['percentage', 'fixed_amount'],
    }).notNull(),
    discountValue: integer('discount_value').notNull(),
    minBookingAmount: integer('min_booking_amount').default(0),
    maxDiscountAmount: integer('max_discount_amount'),
    startDate: timestamp('start_date', { mode: 'string' }).notNull(),
    endDate: timestamp('end_date', { mode: 'string' }).notNull(),
    usageLimit: integer('usage_limit'),
    usageCount: integer('usage_count').default(0),
    isActive: boolean('is_active').default(true),
    applicablePropertyTypes: jsonb('applicable_property_types'),
    applicableRoomTypes: jsonb('applicable_room_types'),
    specificPropertyIds: jsonb('specific_property_ids'),
    userType: varchar('user_type', {
        enum: ['all', 'new', 'existing', 'specific'],
    }).default('all'),
    createdAt: timestamp('created_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
});

export const couponsRelations = relations(coupons, ({ many }) => ({
    bookings: many(bookings),
    userCoupons: many(userCoupons),
}));

export default coupons;