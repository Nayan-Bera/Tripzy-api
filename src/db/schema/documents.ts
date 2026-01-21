import { relations } from 'drizzle-orm';
import { pgTable, uuid, text, varchar } from 'drizzle-orm/pg-core';
import users from './user';
import bookings from './booking';
import familyMembers from './familymabers';

const documents = pgTable('documents', {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    bookingId: uuid('booking_id')
        .notNull()
        .references(() => bookings.id),
    userId: uuid('user_id')
        .notNull()
        .references(() => users.id),
    familyMemberId: uuid('family_member_id').references(
        () => familyMembers.id,
        { onDelete: 'cascade' },
    ),

    documentType: varchar('document_type', {
        enum: ['passport', 'aadhar', 'license', 'other'],
    }).notNull(),
    documentNumber: text('document_number').notNull(),
    documentFileUrl: text('document_file_url').notNull(),
});

export const documentRelations = relations(documents, ({ one }) => ({
    booking: one(bookings, {
        fields: [documents.bookingId],
        references: [bookings.id],
    }),
    user: one(users, {
        fields: [documents.userId],
        references: [users.id],
    }),
    familyMember: one(familyMembers, {
    fields: [documents.familyMemberId],
    references: [familyMembers.id],
  }),
}));

export default documents;
