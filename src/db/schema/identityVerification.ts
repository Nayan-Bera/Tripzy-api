import { relations } from 'drizzle-orm';
import {
    pgTable,
    timestamp,
    uuid,
    varchar,
    jsonb,
    boolean
} from 'drizzle-orm/pg-core';
import user from './user';

const identityVerification = pgTable('identity_verification', {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    userId: uuid('user_id')
        .references(() => user.id, {
            onDelete: 'cascade',
            onUpdate: 'no action',
        })
        .notNull(),
    documentType: varchar('document_type', {
        enum: ['passport', 'drivers_license', 'national_id', 'aadhar_card', 'pan_card'],
    }).notNull(),
    documentNumber: varchar('document_number').notNull(),
    documentImages: jsonb('document_images').notNull(), // Array of image URLs
    verificationStatus: varchar('verification_status', {
        enum: ['pending', 'verified', 'rejected'],
    }).default('pending'),
    verificationNotes: varchar('verification_notes'),
    verifiedBy: uuid('verified_by')
        .references(() => user.id),
    verifiedAt: timestamp('verified_at', { mode: 'string' }),
    qrCode: varchar('qr_code').unique(),
    createdAt: timestamp('created_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
});

export const identityVerificationRelations = relations(identityVerification, ({ one }) => ({
    user: one(user, {
        fields: [identityVerification.userId],
        references: [user.id],
    }),
    verifier: one(user, {
        fields: [identityVerification.verifiedBy],
        references: [user.id],
    }),
}));

export default identityVerification; 