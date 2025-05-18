import Joi from "joi";

export const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    phone: Joi.string().required(),
    role: Joi.string().required(),
    status: Joi.string().required(),
    createdAt: Joi.date().required(),
    updatedAt: Joi.date().required(),
});

