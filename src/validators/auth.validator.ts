import Joi from "joi";

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

export const changePasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required(),
    password: Joi.string().min(6).required()
});

export const updatePasswordSchema = Joi.object({
    current_password: Joi.string().required(),
    password: Joi.string().min(6).required()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$'))
        .message('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
});

export const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required()
});

export const resetPasswordSchema = Joi.object({
    otp: Joi.string().length(6).required(),
    newPassword: Joi.string().min(6).required(),
    email: Joi.string().email().required()
});