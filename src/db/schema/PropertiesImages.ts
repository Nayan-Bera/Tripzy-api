import { relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import user from './user';
import properties from './properties';

const propertyImages = pgTable('propertyImages', {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    propertyId: uuid('property_id').references(() => properties.id,{
        onDelete: 'cascade',
        onUpdate: 'no action',
    }).notNull(),
    image: varchar('image').notNull(),
    createdAt: timestamp('created_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
});

export const propertyImagesRelations = relations(
    propertyImages,
    ({ one, many }) => ({
        user: one(user, {
            fields: [propertyImages.propertyId],
            references: [user.id],
        }),
        properties: one(properties,{
            fields: [propertyImages.propertyId],
            references: [properties.id],
        })
    }),
);

export default propertyImages;
