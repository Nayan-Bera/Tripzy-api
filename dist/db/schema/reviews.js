"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRelations = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const user_1 = __importDefault(require("./user"));
const properties_1 = __importDefault(require("./properties"));
const drizzle_orm_1 = require("drizzle-orm");
const reviews = (0, pg_core_1.pgTable)("reviews", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey().notNull(),
    userId: (0, pg_core_1.uuid)("user_id").notNull().references(() => user_1.default.id),
    propertyId: (0, pg_core_1.uuid)("property_id").notNull().references(() => properties_1.default.id),
    rating: (0, pg_core_1.integer)("rating").notNull(),
    comment: (0, pg_core_1.text)("comment").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
});
exports.reviewRelations = (0, drizzle_orm_1.relations)(reviews, ({ one }) => ({
    user: one(user_1.default, {
        fields: [reviews.userId],
        references: [user_1.default.id],
    }),
    property: one(properties_1.default, {
        fields: [reviews.propertyId],
        references: [properties_1.default.id],
    }),
}));
exports.default = reviews;
