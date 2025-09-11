import Joi from 'joi';

export const userValidation = {
  create: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
  
  update: Joi.object({
    name: Joi.string().min(2).max(100),
    email: Joi.string().email(),
  }),
  
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

export const productValidation = {
  create: Joi.object({
    name: Joi.string().min(2).max(200).required(),
    description: Joi.string().max(1000),
    price: Joi.number().positive().required(),
    stock: Joi.number().integer().min(0).required(),
    blingId: Joi.string(),
  }),
  
  update: Joi.object({
    name: Joi.string().min(2).max(200),
    description: Joi.string().max(1000),
    price: Joi.number().positive(),
    stock: Joi.number().integer().min(0),
    blingId: Joi.string(),
  }),
};

export const orderValidation = {
  create: Joi.object({
    userId: Joi.string().required(),
    items: Joi.array().items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().integer().positive().required(),
      })
    ).min(1).required(),
  }),
  
  update: Joi.object({
    status: Joi.string().valid(
      'PENDING',
      'CONFIRMED',
      'PROCESSING',
      'SHIPPED',
      'DELIVERED',
      'CANCELLED'
    ),
  }),
};
