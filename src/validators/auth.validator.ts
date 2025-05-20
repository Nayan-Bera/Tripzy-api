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

export const registerSchema: ObjectSchema = Joi.object({
    fullname: Joi.string().min(3).max(30).required().messages({
        'string.base': `full name should be a type of 'text'`,
        'string.empty': `full name cannot be an empty field`,
        'string.min': `full name should have a minimum length of {#limit}`,
        'string.max': `full name should have a maximum length of {#limit}`,
        'any.required': `full name is a required field`,
    }),
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

    role: Joi.string()
        .valid('buyer', 'owner', 'agent', 'builder')
        .required()
        .messages({
            'string.base': `role should be a type of 'text'`,
            'string.empty': `role cannot be an empty field`,
            'any.only': `role should be either 'buyer', 'owner', 'agent', or 'builder'`,
            'any.required': `role is a required field`,
        }),
    phone_number: Joi.string()
        .pattern(/^\d{10}$/)
        .required()
        .messages({
            'string.pattern.base': `Phone number must be exactly 10 digits`,
            'string.empty': `phone number cannot be an empty field`,
            'any.required': `phone number is a required field`,
        }),
});