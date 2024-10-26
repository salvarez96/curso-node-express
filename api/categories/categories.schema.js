const Joi = require('joi');

const id = Joi.number().integer()
const name = Joi.string().min(3).max(20)
const description = Joi.string().min(10).max(100)
const image = Joi.string().uri()

const createCategorySchema = Joi.object({
  name: name.required(),
  description: description.required(),
  image: image
})

const updateCategorySchema = Joi.object({
  name: name,
  description: description,
  image: image
})

const getCategorySchema = Joi.object({
  id: id.required()
})

const deleteCategorySchema = getCategorySchema

module.exports = {
  createCategorySchema,
  updateCategorySchema,
  getCategorySchema,
  deleteCategorySchema
}
