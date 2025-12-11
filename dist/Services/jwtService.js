"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../config/index");
class JwtService {
    static sign(payload, expiry = '1hr', secret = index_1.config.ACCESS_SECRET) {
        const options = { expiresIn: expiry };
        return jsonwebtoken_1.default.sign(payload, secret, options);
    }
    static verify(token, secret = index_1.config.ACCESS_SECRET) {
        try {
            const { id, role } = jsonwebtoken_1.default.verify(token, secret);
            return {
                id,
                role,
            };
        }
        catch (error) {
            return {
                error,
            };
        }
    }
}
exports.default = JwtService;
