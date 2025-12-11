"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomAvailabilityRelations = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const room_1 = __importDefault(require("./room"));
const roomAvailabilities = (0, pg_core_1.pgTable)("room_availabilities", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey().notNull(),
    roomId: (0, pg_core_1.uuid)("room_id").notNull().references(() => room_1.default.id),
    dayOfWeek: (0, pg_core_1.integer)("day_of_week").notNull(),
    openTime: (0, pg_core_1.time)("open_time").notNull(),
    closeTime: (0, pg_core_1.time)("close_time").notNull(),
});
exports.roomAvailabilityRelations = (0, drizzle_orm_1.relations)(roomAvailabilities, ({ one }) => ({
    room: one(room_1.default, {
        fields: [roomAvailabilities.roomId],
        references: [room_1.default.id],
    }),
}));
exports.default = roomAvailabilities;
