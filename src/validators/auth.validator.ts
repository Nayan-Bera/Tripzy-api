import Joi, { ObjectSchema } from 'joi';

export const changePasswordSchema: ObjectSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required(),
    password: Joi.string().min(6).required()
});

export const updatePasswordSchema: ObjectSchema = Joi.object({
    current_password: Joi.string().required(),
    password: Joi.string().min(6).required()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$'))
        .message('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
});

export const forgotPasswordSchema: ObjectSchema = Joi.object({
    email: Joi.string().email().required()
});

export const resetPasswordSchema: ObjectSchema = Joi.object({
    otp: Joi.string().length(6).required(),
    newPassword: Joi.string().min(6).required(),
    email: Joi.string().email().required()
});


export const loginSchema: ObjectSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': `email must be a valid email`,
        'string.empty': `email cannot be an empty field`,
        'any.required': `email is a required field`,
    }),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+{}|:"<>?~-]{8,30}$'))
        .required()
        .messages({
            'string.pattern.base': `password must be between 8-30 characters and can include letters, numbers, and special characters`,
            'string.empty': `password cannot be an empty field`,
            'any.required': `password is a required field`,
        }),
});