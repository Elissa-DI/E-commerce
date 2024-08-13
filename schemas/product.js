import Joi from 'joi';

const productSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().positive().required(),
  category: Joi.string().required(),
  stock: Joi.number().integer().min(0).required(),
});

export {
    productSchema
}