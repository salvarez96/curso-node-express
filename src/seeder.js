require('module-alias/register')
const { createFakeProducts } = require('@products/products.seeder')

createFakeProducts()
  .then(( res ) => console.log(res))
  .catch(( err ) => console.error(err))
