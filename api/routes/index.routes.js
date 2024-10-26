const express = require('express');
const productsRouter = require('@products/products.routes');
const categoriesRouter = require('@categories/categories.routes');
const usersRouter = require('@users/users.routes');

function routerApi(app) {
  // configuring the main endpoint /api/v1:
  const v1Router = express.Router()
  app.use('/api/v1', v1Router)

  v1Router.use('/products', productsRouter)
  v1Router.use('/categories', categoriesRouter)
  v1Router.use('/users', usersRouter)
}

module.exports = routerApi
