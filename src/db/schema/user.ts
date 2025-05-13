import { relations } from 'drizzle-orm';
import {
    boolean,
    pgTable,
    timestamp,
    uuid,
    varchar,
  
} from 'drizzle-orm/pg-core';
import userDetails from './userDetails';

// User model - extended with additional verification fields
const user = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    fullname: varchar('fullname').notNull(),
    email: varchar('email').notNull().unique(),
    password: varchar('password').notNull(),
    role: varchar('role', {
        enum: ['customer', 'admin', 'provider', 'hotel_staff'],  // Added hotel_staff role
    }).default('customer'),
    avatar: varchar('avatar'),
    phone_number: varchar('phone_number').notNull(),
    address: varchar('address'),
    status: varchar('status', {
        enum: ['active', 'inactive', 'suspended', 'deleted'],
    }).default('active'),
    email_verified: boolean('email_verified').default(false),
    phone_verified: boolean('phone_verified').default(false),    // Phone verification status
    biometric_registered: boolean('biometric_registered').default(false), // For ID-less check-in
    createdAt: timestamp('created_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
});

export const userRelations = relations(user, ({ one, many }) => ({
    userDetails: one(userDetails, {
        fields: [user.id],
        references: [userDetails.user_id],
    }),
    // favorites: many(favorites),
    // propertybookings: many(propertybookings),
    // leads: many(leads),
}));

export default user;
