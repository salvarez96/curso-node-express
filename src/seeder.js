require('module-alias/register')
const { createDataFile } = require('./helpers/createDataFile');
const { createFakeProducts } = require('@products/products.seeder');


createFakeProducts()
  .then(( res ) => console.log(res))
  .catch(( err ) => console.error(err))
// createDataFile('products.json')
//     .then((message) => console.log(message))
//     .catch((err) => console.error(err))
