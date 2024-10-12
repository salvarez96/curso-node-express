const { Router } = require('express');
const { ProductsService } = require('@services/products/products.service')
const boom = require('@hapi/boom');

const router = Router()
const productsService = new ProductsService()
// ruta para enviar todos los productos al front
router.get('/', async (req, res, next) => {
  try {
    const { size } = req.query
    const productsList = await productsService.find()
    let filteredProducts = []

    if (size && size < productsList.metadata.totalItems) {
      filteredProducts = productsList.data.splice(0, size)
    } else {
      filteredProducts = productsList.data
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
router.get('/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params
    const product = await productsService.find(productId)

    if (product) {
      res
        .status(200)
        .json({
          statusCode: 200,
          data: await product
        })
    } else {
      throw boom.notFound(`No product with id: ${productId}`)
    }
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const body = req.body
    const propertyList = ['productName', 'productPrice']
    const propertiesNotIncluded = []

    propertyList.forEach(property => {
      if (!body[property]) {
        propertiesNotIncluded.push(property)
      }
    })

    if (propertiesNotIncluded.length) {
      throw boom.badRequest(`The following properties are missing from the body: ${propertiesNotIncluded}`)
    }

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
})

router.patch('/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params
    const body = req.body
    const acceptedPropertyList = ['productName', 'productPrice', 'productImage']
    const product = await productsService.update(productId, body, acceptedPropertyList)

    if (!product) {
      switch (product) {
        case null:
          throw boom.badRequest(`Object with id ${productId} hasn't been updated due to unchanges in its specific properties.`)
        case false:
          throw boom.notFound(`The product with id ${productId} doesn't exist.`)
      }
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
})

router.delete('/:productId', async (req, res, next) => {
  try {
    const { productId }= req.params
    const product = await productsService.delete(productId)

    if (!product) {
      throw boom.notFound(`Unable to delete product with id: ${productId}. The product doesn't exist.`)
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
})

module.exports = router
