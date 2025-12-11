"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hotelRelations = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const user_1 = __importDefault(require("./user"));
const properties_1 = __importDefault(require("./properties"));
const payouts_1 = __importDefault(require("./payouts"));
const hotels = (0, pg_core_1.pgTable)("hotels", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey().notNull(),
    userId: (0, pg_core_1.uuid)("user_id").notNull().references(() => user_1.default.id),
    name: (0, pg_core_1.text)("name").notNull(),
    contact: (0, pg_core_1.text)("contact").notNull(),
    verified: (0, pg_core_1.boolean)("verified").notNull().default(false),
});
exports.hotelRelations = (0, drizzle_orm_1.relations)(hotels, ({ one, many }) => ({
    user: one(user_1.default, {
        fields: [hotels.userId],
        references: [user_1.default.id],
    }),
    properties: many(properties_1.default),
    payouts: many(payouts_1.default),
}));
exports.default = hotels;
