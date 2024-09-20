const express = require('express');
const productsRouter = require('@products/products.routes');

function routerApi(app) {
  // configuring the main endpoint /api/v1:
  const v1Router = express.Router()
  app.use('/api/v1', v1Router)

  v1Router.use('/products', productsRouter)
}

module.exports = routerApi
