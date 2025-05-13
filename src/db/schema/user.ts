import { relations } from 'drizzle-orm';
import {
    boolean,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from 'drizzle-orm/pg-core';

export const user = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    fullname: varchar('fullname').notNull(),
    email: varchar('email').notNull().unique(),
    password: varchar('password').notNull(),
    role: varchar('role', {
        enum: ['customer', 'admin', 'provider', 'staff'],
    }).default('customer'),
    avatar: varchar('avatar'),
    phone_number: varchar('phone_number').notNull(),
    address: varchar('address'),
    status: varchar('status', {
        enum: ['active', 'inactive', 'suspended', 'deleted'],
    }).default('active'),
    email_verified: boolean('email_verified').default(false),
    phone_verified: boolean('phone_verified').default(false),
    createdAt: timestamp('created_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
});

export const userRelations = relations(user, ({ one, many }) => ({
    userDetails: one(userDetails),
    properties: many(properties),
    bookings: many(bookings),
    reviews: many(reviews),
    payments: many(payments),
    favorites: many(favorites),
    coupons: many(userCoupons),
    notifications: many(notifications),
}));
