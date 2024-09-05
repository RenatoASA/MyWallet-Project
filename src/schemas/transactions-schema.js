import joi from 'joi';

export const transactionsSchema = joi.object({
    value: joi.number().required(),
    description: joi.string().required(),
    type: joi.string().required()
  });