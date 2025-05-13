import { is, relations } from 'drizzle-orm';
import {
    boolean,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from 'drizzle-orm/pg-core';
import user from './user';

export const userDetails = pgTable('user_details', {
    id: uuid('id').defaultRandom().primaryKey(),
    user_id: uuid('user_id')
        .notNull()
        .references(() => user.id, {
            onDelete: 'cascade',
            onUpdate: 'no action',
        }).unique(),
    pan_number: varchar('pan_number'),
    gst_number: varchar('gst_number'),
    passport_number: varchar('passport_number'),
    aadhar_number: varchar('aadhar_number'),
    address: varchar('address'),
    city: varchar('city'),
    state: varchar('state'),
    country: varchar('country'),
    pincode: varchar('pincode'),
    is_verified: boolean('is_verified').default(false),
    documents: varchar('documents'),
    documents_type: varchar('documents_type', {
        enum: ['pan', 'aadhar', 'passport', 'driving_license', 'voter_id'],
    }),
    digital_verification_status: varchar('digital_verification_status', {
        enum: ['pending', 'verified', 'rejected', 'not_submitted'],
    }).default('not_submitted'),
    verification_notes: varchar('verification_notes'),
    createdAt: timestamp('created_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
});

export const userDetailsRelations = relations(userDetails, ({ one }) => ({
    user: one(user, {
        fields: [userDetails.user_id],
        references: [user.id],
    }),
}));



export default userDetails;
