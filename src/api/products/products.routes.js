const { Router } = require('express');
const productsList = require('@data/products.json');
const fs = require('fs').promises;
const { faker } = require('@faker-js/faker')

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
    const productsDataPath = process.cwd() + '/data/products.json'
    const productsData = JSON.parse(await fs.readFile(productsDataPath, {encoding: 'utf8'}))

    productsData.metadata.lastItemId += 1
    productsData.metadata.totalItems += 1

    const cleanBody = {
      'productId': productsData.metadata.lastItemId,
      'productName': body.productName,
      'productPrice': body.productPrice,
      'productImage': faker.image.url()
    }

    productsData.data.push(cleanBody)

    await fs.writeFile(productsDataPath, JSON.stringify(productsData, null, 2))

    res
      .status(200)
      .json({
        status: 200,
        message: "Product created successfully",
        data: cleanBody
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

module.exports = router
