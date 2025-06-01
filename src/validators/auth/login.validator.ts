import Joi, { ObjectSchema } from 'joi';

const loginSchema: ObjectSchema = Joi.object({
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

export default loginSchema;
