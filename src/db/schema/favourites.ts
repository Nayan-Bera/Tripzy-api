import { relations } from 'drizzle-orm';
import {
    boolean,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from 'drizzle-orm/pg-core';
import user from './user';
import properties from './properties';
const favorites = pgTable('favorites', {
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
    createdAt: timestamp('created_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
});

export const favoritesRelations = relations(favorites, ({ one }) => ({
    user: one(user, {
        fields: [favorites.userId],
        references: [user.id],
    }),
    property: one(properties, {
        fields: [favorites.propertyId],
        references: [properties.id],
    }),
}));

export default favorites;