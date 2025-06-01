import Joi,{ ObjectSchema } from 'joi';
const changePasswordSchema: ObjectSchema  = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': `Email must be a valid email`,
        'string.empty': `Email cannot be an empty field`,
        'any.required': `Email is a required field`,
    }),
    otp: Joi.string().required().messages({
        'string.empty': `OTP cannot be an empty field`,
        'any.required': `OTP is a required field`,
    }),
    password: Joi.string()
        .pattern(
            new RegExp('^[a-zA-Z0-9!@#$%^&*()_+{}|:"<>?~-]{8,30}$'),
        )
        .required()
        .messages({
            'string.pattern.base': `Password must be between 8-30 characters and can include letters, numbers, and special characters`,
            'string.empty': `Password cannot be an empty field`,
            'any.required': `Password is a required field`,
        }),
    repeat_password: Joi.any()
        .valid(Joi.ref('password'))
        .required()
        .messages({
            'any.only': `Repeat password must match "password"`,
            'any.required': `Repeat password is a required field`,
        }),
});
export default changePasswordSchema;
