const Joi = require('joi');

const id = Joi.number().integer()
const productName = Joi.string().alphanum()
const productPrice = Joi.number().positive().min(1)
const productImage = Joi.string().uri()

const createProductSchema = Joi.object({
  id: id.invalid(),
  productName: productName.required(),
  productPrice: productPrice.required(),
  productImage: productImage
})

const updateProductSchema = Joi.object({
  id: id.invalid(),
  productName: productName,
  productPrice: productPrice,
  productImage: productImage
})

const getProductSchema = Joi.object({
  id: id.required()
})

module.exports = {
  createProductSchema,
  updateProductSchema,
  getProductSchema
}
