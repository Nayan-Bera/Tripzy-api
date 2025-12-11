"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.familyMemberRelations = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const user_1 = __importDefault(require("./user"));
const familyMembers = (0, pg_core_1.pgTable)("family_members", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey().notNull(),
    userId: (0, pg_core_1.uuid)("user_id").notNull().references(() => user_1.default.id),
    name: (0, pg_core_1.text)("name").notNull(),
    relation: (0, pg_core_1.text)("relation").notNull(),
    dateOfBirth: (0, pg_core_1.text)("date_of_birth").notNull(),
});
exports.familyMemberRelations = (0, drizzle_orm_1.relations)(familyMembers, ({ one }) => ({
    user: one(user_1.default, {
        fields: [familyMembers.userId],
        references: [user_1.default.id],
    }),
}));
exports.default = familyMembers;
