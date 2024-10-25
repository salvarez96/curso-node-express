require('module-alias/register')
const { createFakeProducts } = require('@products/products.seeder')
const { createFakeCategories } = require('@categories/categories.seeder')

createFakeProducts()
  .then(( res ) => console.log(res))
  .catch(( err ) => console.error(err))

createFakeCategories()
  .then(( res ) => console.log(res))
  .catch(( err ) => console.error(err))
