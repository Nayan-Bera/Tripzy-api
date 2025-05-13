import { is, relations } from 'drizzle-orm';
import {
    boolean,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from 'drizzle-orm/pg-core';
import user from './user';

const userDetails = pgTable('user_details', {
    id: uuid('id').defaultRandom().primaryKey(),
    user_id: uuid('user_id')
        .notNull()
        .references(() => user.id, {
            onDelete: 'cascade',
            onUpdate: 'no action',
        }),
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
    documents: varchar('documents'),  // Corrected spelling from 'ducuments'
    documents_type: varchar('documents_type', {
        enum: ['pan', 'aadhar', 'passport', 'driving_license', 'voter_id'],
    }),
    // Biometric data for ID-less check-in (securely encrypted)
    face_template: varchar('face_template'),
    fingerprint_template: varchar('fingerprint_template'),
    biometric_verified: boolean('biometric_verified').default(false),
    createdAt: timestamp('created_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
});

export const userDetailsRelations = relations(userDetails, ({ one, many }) => ({
    user: one(user, {
        fields: [userDetails.user_id],
        references: [user.id],
    }),
}));

export default userDetails;
