// validations/product.validation.js
const Joi = require('joi');

const productSchema = Joi.object({
  name: Joi.string().trim().max(120),
  price: Joi.number().min(0),
  stock: Joi.number().integer().min(0),
  category: Joi.string().trim().max(60),
  status: Joi.string().valid('active', 'inactive'),
});

const productImportSchema = Joi.object({
  name: Joi.string().trim().max(120).required(),
  price: Joi.number().min(0).required(),
  stock: Joi.number().integer().min(0).required(),
  category: Joi.string().trim().max(60).required(),
  status: Joi.string().valid('active', 'inactive'),
});

module.exports = { productSchema,productImportSchema };
