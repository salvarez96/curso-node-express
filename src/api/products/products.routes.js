const { Router } = require('express');
const { ProductsService } = require('@services/products/products.service')

const router = Router()
const productsService = new ProductsService()
// ruta para enviar todos los productos al front
router.get('/', async (req, res) => {
  try {
    const { size } = req.query
    const productsList = await productsService.find()

    if (size) {
      let filteredProducts = []
      if (size < productsList.metadata.totalItems) {
        productsList.data.some((product, index) => {
          if (index < size) {
            filteredProducts.push(product)
            return false
          }
          return true
        })
      } else {
        filteredProducts = productsList.data
      }

      if (filteredProducts) {
        res
          .status(200)
          .json({
            code: 200,
            data: filteredProducts
          })
      } else {
        res
          .status(204)
          .json({
            code: 204,
            message: `No products in the list.`
          })
      }
    } else {
      res
        .status(200)
        .json({
          code: 200,
          message: 'Products found',
          totalProducts: await productsList.metadata.totalItems,
          data: await productsList.data,
        })
    }
  } catch (err) {
    res
      .status(500)
      .json({
        code: 500,
        message: 'Error retrieving products:', err
      })
    throw err
  }
})

// ruta para filtrar productos por id
router.get('/:productId', async (req, res) => {
  const { productId } = req.params

  try {
    const product = await productsService.find(productId)

    if (product) {
      res
        .status(200)
        .json({
          code: 200,
          data: await product
        })
    } else {
      res
        .status(404)
        .json({
          code: 404,
          message: `No product with id: ${productId}`
        })
    }
  } catch (err) {
    res
      .status(500)
      .json({
        code: 500,
        message: `Error getting product with id: ${productId}`, err
      })
    throw err
  }
})

router.post('/', async (req, res) => {
  const body = req.body
  const propertyList = ['productName', 'productPrice']

  const propertiesNotIncluded = []

  propertyList.forEach(property => {
    if (!body[property]) {
      propertiesNotIncluded.push(property)
    }
  })

  if (propertiesNotIncluded.length) {
    return res
      .status(400)
      .json({
        status: 400,
        message: `The following properties are missing from the body: ${propertiesNotIncluded}`
      })
  }

  try {
    const newProduct = await productsService.create(body)

    return res
      .status(201)
      .json({
        status: 201,
        message: "Product created successfully",
        data: await newProduct
      })
  } catch (err) {
    res
      .status(500)
      .json({
        code: 500,
        message: `Error creating new product`, err
      })
    throw err
  }
})

router.patch('/:productId', async (req, res) => {
  const { productId } = req.params
  const body = req.body
  const acceptedPropertyList = ['productName', 'productPrice', 'productImage']

  try {
    const product = await productsService.update(productId, body, acceptedPropertyList)

    if (!product) {
      switch (product) {
        case null:
          return res
            .status(400)
            .json({
              code: 400,
              message: `Object with id ${productId} hasn't been updated due to unchanges in its specific properties.`
            })
        case false:
          return res
            .status(404)
            .json({
              code: 404,
              message: `The product with id ${productId} doesn't exist.`
            })
      }
    }

    return res
      .status(202)
      .json({
        status: 202,
        message: "Product updated successfully",
        data: await product
      })
  } catch (err) {
    res
      .status(500)
      .json({
        code: 500,
        message: `Error updating product with id ${productId}:`, err
      })
    throw err
  }
})

router.delete('/:productId', async (req, res) => {
  const { productId }= req.params

  try {
    const product = await productsService.delete(productId)

    if (!product) {
      return res
          .status(404)
          .json({
            code: 404,
            message: `Unable to delete product with id: ${productId}. The product doesn't exist.`
          })
    }

    return res
      .status(202)
      .json({
        code: 202,
        message: 'Product deleted successfully.',
        data: await product
      })

  } catch (err) {
    res
      .status(500)
      .json({
        code: 500,
        message: `Error deleting product with id: ${productId},`, err
      })
    throw err
  }
})

module.exports = router
