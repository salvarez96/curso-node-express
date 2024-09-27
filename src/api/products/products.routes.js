const { Router } = require('express');
const productsList = require('@data/products.json');
const { faker } = require('@faker-js/faker');
const { DataFileHandler } = require('@helpers/dataFileHandler');
const { getDataPath } = require('@helpers/getDataPath')

const router = Router()

// ruta para enviar todos los productos al front
router.get('/', (req, res) => {
  try {
    const { size } = req.query

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
          .json(filteredProducts)
      } else {
        res
          .status(404)
          .json({
            code: 404,
            message: `No products in the list.`
          })
      }
    } else {
      res
        .status(200)
        .json(productsList.data)
    }
  } catch (err) {
    res
      .status(500)
      .json({
        code: 500,
        message: 'There was a server error:', err
      })
  }
})

// ruta para filtrar productos por id
router.get('/:productId', (req, res) => {
  try {
    const { productId } = req.params

    const product = productsList.data.find((product) => {
      return product.productId == productId
    })

    if (product) {
      res
        .status(200)
        .json(product)
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
        message: 'There was a server error:', err
      })
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

    const cleanBody = {
      'productName': body.productName,
      'productPrice': body.productPrice,
      'productImage': faker.image.url()
    }

    const dataWriteResponse = await DataFileHandler.writeDataFile('products', cleanBody, { hasMetadata: true })
    console.log(dataWriteResponse.message);

    return res
      .status(200)
      .json({
        status: 200,
        message: "Product created successfully",
        data: dataWriteResponse.data
      })
  } catch (err) {
    res
      .status(500)
      .json({
        code: 500,
        message: 'Internal server error:', err
      })
    throw err
  }
})

router.patch('/:productId', async (req, res) => {
  const { productId } = req.params
  const body = req.body
  const acceptedPropertyList = ['productName', 'productPrice', 'productImage']

  try {
    const productsFilePath = getDataPath('products')
    const products = await DataFileHandler.readDataFile(productsFilePath)

    const product = products.data.find(product => product.id == productId)
    const productKey = products.data.findIndex(product => product.id == productId)

    const acceptedNewProperties = {}

    acceptedPropertyList.forEach(property => {
      if (body[property]) {
        acceptedNewProperties[property] = body[property]
      }
    })

    if (!Object.keys(acceptedNewProperties).length) {
      return res
        .status(200)
        .json({
          code: 200,
          message: `Object with id ${productId} hasn't been updated due to unchanges in its specific properties.`
        })
    }

    const updatedProduct = {...product, ...acceptedNewProperties}

    products.data[productKey] = updatedProduct

    const dataWriteResponse = await DataFileHandler.writeDataFile('products', products, { contentType: 'Product update' })
    console.log(dataWriteResponse);

    return res
      .status(200)
      .json({
        status: 200,
        message: "Product updated successfully",
        data: updatedProduct
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
    const productsFilePath = getDataPath('products')
    const products = await DataFileHandler.readDataFile(productsFilePath)

    const product = products.data.findIndex(product => product.id == productId)

    if (product < 0) {
      return res
          .status(400)
          .json({
            code: 400,
            message: `Unable to delete product with id: ${productId}. The product doesn't exist.`
          })
    }

    const deletedProduct = products.data.splice(product, 1)
    products.metadata.totalItems -= 1

    const dataWriteResponse = await DataFileHandler.writeDataFile('products', products, { contentType: 'Product delete' })
    console.log(dataWriteResponse);

    return res
      .status(200)
      .json({
        code: 200,
        message: 'Product deleted successfully.',
        data: deletedProduct
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
