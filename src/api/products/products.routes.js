const { Router } = require('express');
const productsList = require('@data/products.json');
const { createFakeProducts } = require('@products/products.seeder');

let products = [];

(async () => {
  products = !productsList.length ? await createFakeProducts() : require('@data/products.json')
})()

const router = Router()

// ruta para enviar todos los productos al front
router.get('/', (req, res) => {
  try {
    const { size } = req.query

    if (size) {
      let filteredProducts = []
      if (size < products.length) {
        products.some((product, index) => {
          if (index < size) {
            filteredProducts.push(product)
            return false
          }
          return true
        })
      } else {
        filteredProducts = products
      }

      if (filteredProducts) {
        res
          .status(200)
          .json(filteredProducts)
      } else {
        res
          .status(200)
          .json(`No products in the list.`)
      }
    } else {
      res
        .status(200)
        .json(products)
    }
  } catch (err) {
    res
      .status(500)
      .send('There was a server error:', err)
  }
})

// ruta para filtrar productos por id
router.get('/:productId', (req, res) => {
  try {
    const { productId } = req.params

    const product = products.find((product) => {
      return product.productId == productId
    })

    if (product) {
      res
        .status(200)
        .json(product)
    } else {
      res
        .status(404)
        .json(`No product with id: ${productId}`)
    }
  } catch (err) {
    res
      .status(500)
      .send('There was a server error:', err)
  }
})

router.post('/', (req, res) => {
  // req.body
  const body = req.body
  const propertyList = ['productName', 'productPrice']

  const propertiesNotIncluded = []

  propertyList.forEach(property => {
    if (!body[property]) {
      propertiesNotIncluded.push(property)
    }
  })

  if (propertiesNotIncluded.length) {
    res
      .status(400)
      .json({
        status: 400,
        message: `The following properties are missing from the body: ${propertiesNotIncluded}`
      })
  }

  res
    .status(200)
    .json({
      status: 200,
      message: "Product created successfully",
      data: body
    })
})

module.exports = router
