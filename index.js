const express = require('express');
const os = require('os');
const productsList = require('./src/data/products.json')
const { createFakeProducts } = require('./src/seeders/fakeData')

let products = [];

(async () => {
  products = !productsList.length ? await createFakeProducts() : productsList
})()

const app = express()
const port = 8080
const IP = os.networkInterfaces().eth0[0].address

// ruta a la raíz del proyecto
app.get('/', (req, res) => {
  res.send('Hola, mi server en express')
})

// ruta al home del proyecto
app.get('/home', (req, res) => {
  res.send('Hola, mi server en express que se encuentra en el home')
})

// ruta para enviar todos los productos al front
app.get('/products', (req, res) => {
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
app.get('/products/:productId', (req, res) => {
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

app.listen(port, () => {
  console.log(`Inicia la aplicación en el puerto ${port}`);
  console.log(`Para ver en otros dispositivos:`);
  console.log(`http://${IP}:${port}/`);
})
