"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
// export {default as userRoutes} from './user.route';
// export {default as bookingRoutes} from './booking.route';
var auth_route_1 = require("./auth/auth.route");
Object.defineProperty(exports, "authRoutes", { enumerable: true, get: function () { return __importDefault(auth_route_1).default; } });
