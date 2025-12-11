"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_middleware_1 = require("./error.middleware");
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = __importDefault(require("../db"));
const config_1 = require("../config");
const schema_1 = require("../db/schema");
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1) Get token from header
        const authHeader = req.headers.authorization;
        if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer '))) {
            return next(new error_middleware_1.AppError('Please log in to access this resource', 401));
        }
        const token = authHeader.split(' ')[1];
        // 2) Verify token
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.ACCESS_SECRET);
        // 3) Check if user still exists
        const [user] = yield db_1.default.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, decoded.id));
        if (!user) {
            return next(new error_middleware_1.AppError('User no longer exists', 401));
        }
        // 4) Grant access
        req.user = user;
        next();
    }
    catch (error) {
        next(new error_middleware_1.AppError('Invalid token. Please log in again', 401));
    }
});
exports.protect = protect;
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new error_middleware_1.AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};
exports.restrictTo = restrictTo;
