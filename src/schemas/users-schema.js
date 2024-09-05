import joi from 'joi';

export const schemaLognup = joi.object({
    name: joi.string().required(),
    email: joi.string().required().email(),
    password: joi.string().required().min(6)
})

export const schemaLognin = joi.object({
    email: joi.string().required().email(),
    password: joi.string().required()
});