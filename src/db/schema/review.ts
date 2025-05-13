import { relations } from 'drizzle-orm';
import {
    boolean,
    integer,
    pgTable,
    timestamp,
    uuid,
    varchar
} from 'drizzle-orm/pg-core';
import properties from './properties';
import user from './user';
import bookings from './booking';
const reviews = pgTable('reviews', {
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
    bookingId: uuid('booking_id')
        .references(() => bookings.id, {
            onDelete: 'cascade',
            onUpdate: 'no action',
        })
        .notNull()
        .unique(),
    rating: integer('rating').notNull(),
    review: varchar('review'),
    cleanliness: integer('cleanliness'),
    location: integer('location'),
    service: integer('service'),
    value: integer('value'),
    isApproved: boolean('is_approved').default(false),
    isVisible: boolean('is_visible').default(true),
    createdAt: timestamp('created_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
});

export const reviewsRelations = relations(reviews, ({ one }) => ({
    user: one(user, {
        fields: [reviews.userId],
        references: [user.id],
    }),
    property: one(properties, {
        fields: [reviews.propertyId],
        references: [properties.id],
    }),
    booking: one(bookings, {
        fields: [reviews.bookingId],
        references: [bookings.id],
    }),
}));
export default reviews;