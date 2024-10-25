const { Router } = require('express');
const { CategoriesService } = require('@services/categories/categories.service')
const boom = require('@hapi/boom');
const { validatorHandler } = require('@middlewares/validatorHandler');
const {
  createCategorySchema,
  updateCategorySchema,
  getCategorySchema,
  deleteCategorySchema
} = require('@categories/categories.schema')

const router = Router()
const categoriesService = new CategoriesService()

router.get('/', async (req, res, next) => {
  try {
    const { size } = req.query
    const categoriesList = await categoriesService.find()
    let filteredCategories = []

    if (size && size < categoriesList.metadata.totalItems) {
      filteredCategories = categoriesList.data.splice(0, size)
    } else {
      filteredCategories = categoriesList.data
    }

    if (filteredCategories.length) {
      return res
        .status(200)
        .json({
          statusCode: 200,
          totalCategories: filteredCategories.length,
          data: filteredCategories
        })
    }
    return res
      .status(204)
      .json({
        statusCode: 204,
        message: `No caegories in the list.`
      })
  } catch (err) {
    next(err)
  }
})

// ruta para filtrar categorías por id
router.get('/:id',
  validatorHandler(getCategorySchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params

      const category = await categoriesService.find(id)

      if (category) {
        res
          .status(200)
          .json({
            statusCode: 200,
            data: category
          })
      } else {
        throw boom.notFound(`No category with id: ${id}`)
      }
    } catch (err) {
      next(err)
    }
  }
)

router.post('/',
  validatorHandler(createCategorySchema, 'body'),
  async (req, res, next) => {
    try {
      const { body } = req

      const newCategory = await categoriesService.create(body)

      return res
        .status(201)
        .json({
          statusCode: 201,
          message: "Category created successfully",
          data: await newCategory
        })
    } catch (err) {
      next(err)
    }
  }
)

router.patch('/:id',
  validatorHandler(getCategorySchema, 'params'),
  validatorHandler(updateCategorySchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params
      const { body } = req

      const category = await categoriesService.update(id, body)

      if (!category) {
        throw boom.notFound(`The category with id ${id} doesn't exist.`)
      }

      return res
        .status(202)
        .json({
          statusCode: 202,
          message: "Category updated successfully",
          data: await category
        })
    } catch (err) {
      next(err)
    }
  }
)

router.delete('/:id',
  validatorHandler(deleteCategorySchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params

      const category = await categoriesService.delete(id)

      if (!category) {
        throw boom.notFound(`Unable to delete category with id: ${id}. The category doesn't exist.`)
      }

      return res
        .status(202)
        .json({
          code: 202,
          message: 'Category deleted successfully.',
          data: await category
        })
    } catch (err) {
      next(err)
    }
  }
)

module.exports = router
