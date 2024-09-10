const express = require('express');
const os = require('os');
const products = require('./products.json')

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

// ruta para enviar todos los productos al front o enviar un producto según su id
app.get('/products/:productId?', (req, res) => {
  const { productId } = req.params

  if (Number(productId) >= 0) {
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
  } else {
    res
      .status(200)
      .json(products)
  }
})

app.listen(port, () => {
  console.log(`Inicia la aplicación en el puerto ${port}`);
  console.log(`Para ver en otros dispositivos:`);
  console.log(`http://${IP}:${port}/`);
})
