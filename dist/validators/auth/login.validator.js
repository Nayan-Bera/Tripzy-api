"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        'string.email': `email must be a valid email`,
        'string.empty': `email cannot be an empty field`,
        'any.required': `email is a required field`,
    }),
    password: joi_1.default.string()
        .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+{}|:"<>?~-]{8,30}$'))
        .required()
        .messages({
        'string.pattern.base': `password must be between 8-30 characters and can include letters, numbers, and special characters`,
        'string.empty': `password cannot be an empty field`,
        'any.required': `password is a required field`,
    }),
});
exports.default = loginSchema;
