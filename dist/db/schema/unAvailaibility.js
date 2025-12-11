"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unavailabilityRelations = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const room_1 = __importDefault(require("./room"));
const unavailabilities = (0, pg_core_1.pgTable)("unavailabilities", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey().notNull(),
    roomId: (0, pg_core_1.uuid)("room_id").notNull().references(() => room_1.default.id),
    reason: (0, pg_core_1.text)("reason").notNull(),
    from: (0, pg_core_1.timestamp)("from").notNull(),
    to: (0, pg_core_1.timestamp)("to").notNull(),
});
exports.unavailabilityRelations = (0, drizzle_orm_1.relations)(unavailabilities, ({ one }) => ({
    room: one(room_1.default, {
        fields: [unavailabilities.roomId],
        references: [room_1.default.id],
    }),
}));
exports.default = unavailabilities;
