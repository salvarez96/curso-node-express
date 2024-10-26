const { Router } = require('express');
const { ProductsService } = require('@services/products/products.service')
const boom = require('@hapi/boom');
const { validatorHandler } = require('@middlewares/validatorHandler');
const {
  createProductSchema,
  updateProductSchema,
  getProductSchema,
  deleteProductSchema
} = require('@products/products.schema')

const router = Router()
const productsService = new ProductsService()

router.get('/', async (req, res, next) => {
  try {
    const { size } = req.query
    const products = await productsService.find()
    let filteredProducts = []

    if (size && size < products.metadata.totalItems) {
      filteredProducts = products.data.splice(0, size)
    } else {
      filteredProducts = products.data
    }

    if (filteredProducts.length) {
      return res
        .status(200)
        .json({
          statusCode: 200,
          totalProducts: filteredProducts.length,
          data: filteredProducts
        })
    }
    return res
      .status(204)
      .json({
        statusCode: 204,
        message: `No products in the list.`
      })
  } catch (err) {
    next(err)
  }
})

// ruta para filtrar productos por id
router.get('/:id',
  validatorHandler(getProductSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params

      const product = await productsService.find(id)

      if (product) {
        res
          .status(200)
          .json({
            statusCode: 200,
            data: product
          })
      } else {
        throw boom.notFound(`No product with id: ${id}`)
      }
    } catch (err) {
      next(err)
    }
  }
)

router.post('/',
  validatorHandler(createProductSchema, 'body'),
  async (req, res, next) => {
    try {
      const { body } = req

      const newProduct = await productsService.create(body)

      return res
        .status(201)
        .json({
          statusCode: 201,
          message: "Product created successfully",
          data: await newProduct
        })
    } catch (err) {
      next(err)
    }
  }
)

router.patch('/:id',
  validatorHandler(getProductSchema, 'params'),
  validatorHandler(updateProductSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params
      const { body } = req

      const product = await productsService.update(id, body)

      if (!product) {
        throw boom.notFound(`The product with id ${id} doesn't exist.`)
      }

      return res
        .status(202)
        .json({
          statusCode: 202,
          message: "Product updated successfully",
          data: await product
        })
    } catch (err) {
      next(err)
    }
  }
)

router.delete('/:id',
  validatorHandler(deleteProductSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params

      const product = await productsService.delete(id)

      if (!product) {
        throw boom.notFound(`Unable to delete product with id: ${id}. The product doesn't exist.`)
      }

      return res
        .status(202)
        .json({
          code: 202,
          message: 'Product deleted successfully.',
          data: await product
        })
    } catch (err) {
      next(err)
    }
  }
)

module.exports = router
