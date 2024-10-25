const Joi = require('joi');

const id = Joi.number().integer()
const categoryName = Joi.string().min(3).max(20)
const categoryDescription = Joi.string().min(10).max(100)
const categoryImage = Joi.string().uri()

const createCategorySchema = Joi.object({
  categoryName: categoryName.required(),
  categoryDescription: categoryDescription.required(),
  categoryImage: categoryImage
})

const updateCategorySchema = Joi.object({
  categoryName: categoryName,
  categoryDescription: categoryDescription,
  categoryImage: categoryImage
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
