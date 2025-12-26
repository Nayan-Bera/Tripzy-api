import { relations } from 'drizzle-orm';
import {
    boolean,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
} from 'drizzle-orm/pg-core';
import bookings from './booking';
import documents from './documents';
import otps from './emailOtp';
import familyMembers from './familymabers';
import favorites from './favorites';
import hotels from './hotel';
import hotelUsers from './hotelUser';
import images from './image';
import notifications from './notifications';
import refreshTokens from './refreshtoken';
import reviews from './reviews';

const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    platformRole: varchar('platform_role', {
        enum: ['user', 'admin', 'super_admin', 'hotel'],
    })
        .notNull()
        .default('user'),

    status: varchar('status', { enum: ['active', 'inactive'] })
        .notNull()
        .default('active'),
    email_verified: boolean('email_verified').notNull().default(false),
    phone_number: varchar('phone_number'),
    avatar: varchar('avatar'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const userRelations = relations(users, ({ one, many }) => ({
    ownedHotels: many(hotels),
    hotelAccess: many(hotelUsers),
    bookings: many(bookings),
    documents: many(documents),
    familyMembers: many(familyMembers),
    images: many(images),
    reviews: many(reviews),
    favorites: many(favorites),
    notifications: many(notifications),
    refreshTokens: many(refreshTokens),
    otps: many(otps),
}));

export default users;
