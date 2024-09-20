const productsRouter = require('@products/products.routes');

function routerApi(app) {
  app.use('/api/products', productsRouter)
}

module.exports = routerApi
