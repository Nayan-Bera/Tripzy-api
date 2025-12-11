"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const changePasswordSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        'string.email': `Email must be a valid email`,
        'string.empty': `Email cannot be an empty field`,
        'any.required': `Email is a required field`,
    }),
    otp: joi_1.default.string().required().messages({
        'string.empty': `OTP cannot be an empty field`,
        'any.required': `OTP is a required field`,
    }),
    password: joi_1.default.string()
        .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+{}|:"<>?~-]{8,30}$'))
        .required()
        .messages({
        'string.pattern.base': `Password must be between 8-30 characters and can include letters, numbers, and special characters`,
        'string.empty': `Password cannot be an empty field`,
        'any.required': `Password is a required field`,
    }),
    repeat_password: joi_1.default.any()
        .valid(joi_1.default.ref('password'))
        .required()
        .messages({
        'any.only': `Repeat password must match "password"`,
        'any.required': `Repeat password is a required field`,
    }),
});
exports.default = changePasswordSchema;
