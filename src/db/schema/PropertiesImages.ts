import { relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid, varchar,boolean } from 'drizzle-orm/pg-core';
import user from './user';
import properties from './properties';

export const propertyImages = pgTable('property_images', {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    propertyId: uuid('property_id')
        .references(() => properties.id, {
            onDelete: 'cascade',
            onUpdate: 'no action',
        })
        .notNull(),
    image: varchar('image').notNull(),
    caption: varchar('caption'),
    isPrimary: boolean('is_primary').default(false),
    createdAt: timestamp('created_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
});

export const propertyImagesRelations = relations(propertyImages, ({ one }) => ({
    property: one(properties, {
        fields: [propertyImages.propertyId],
        references: [properties.id],
    }),
}));;

export default propertyImages;
