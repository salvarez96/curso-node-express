require('module-alias/register')
const { faker } = require('@faker-js/faker')
const { DataFileHandler } = require('@helpers/dataFileHandler')

async function createFakeProducts(quantity = 20) {
  try {
    const products = []

    for (let index = 0; index < quantity; index++) {
      products.push({
        "id": index,
        "productName": faker.commerce.product(),
        "productPrice": faker.commerce.price({ min: 10, max: 500 }) * 1,
        "productImage": faker.image.url(),
      })
    }

    return await DataFileHandler.handleJsonFile('products', products, 'Products')

  } catch (error) {
    console.error(`Error registering fake products:`)
    throw error
  }
}

module.exports = {
  createFakeProducts
}
