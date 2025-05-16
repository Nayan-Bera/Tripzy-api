import { relations } from 'drizzle-orm';
import {
    jsonb,
    pgTable,
    timestamp,
    uuid,
    varchar
} from 'drizzle-orm/pg-core';
import user from './user';
const digitalVerification = pgTable('digital_verification', {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    userId: uuid('user_id')
        .references(() => user.id, {
            onDelete: 'cascade',
            onUpdate: 'no action',
        })
        .notNull()
        .unique(),
    verificationType: varchar('verification_type', {
        enum: ['face_recognition', 'document_verification', 'phone_verification', 'email_verification'],
    }).notNull(),
    verificationData: jsonb('verification_data').notNull(),
    status: varchar('status', {
        enum: ['pending', 'verified', 'rejected', 'expired'],
    }).default('pending'),
    expiryDate: timestamp('expiry_date', { mode: 'string' }),
    rejectionReason: varchar('rejection_reason'),
    createdAt: timestamp('created_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
});

export const digitalVerificationRelations = relations(digitalVerification, ({ one }) => ({
    user: one(user, {
        fields: [digitalVerification.userId],
        references: [user.id],
    }),
}));
export default digitalVerification;