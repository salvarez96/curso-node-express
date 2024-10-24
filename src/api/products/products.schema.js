const Joi = require('joi');

const id = Joi.number().integer()
const productName = Joi.string().min(3).max(20)
const productPrice = Joi.number().positive().min(1)
const productImage = Joi.string().uri()

const createProductSchema = Joi.object({
  productName: productName.required(),
  productPrice: productPrice.required(),
  productImage: productImage
})

const updateProductSchema = Joi.object({
  productName: productName,
  productPrice: productPrice,
  productImage: productImage
})

const getProductSchema = Joi.object({
  id: id.required()
})

const deleteProductSchema = getProductSchema

module.exports = {
  createProductSchema,
  updateProductSchema,
  getProductSchema,
  deleteProductSchema
}
