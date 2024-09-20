require('module-alias/register')
const { faker } = require('@faker-js/faker')
const fs = require('fs');
const { createDataFile } = require('@helpers/createDataFile')
const { writeDataFile } = require('@helpers/writeDataFile')

async function createFakeProducts(quantity = 20) {
  try {
    const products = []

    const { path, fileName, message, isFileNew } = await createDataFile('products.json')

    console.log(message);

    if (!isFileNew) {
      return `Because ${fileName} already exists, it won't be overwritten.`
    }

    for (let index = 0; index < quantity; index++) {
      products.push({
        "productId": index,
        "productName": faker.commerce.product(),
        "productPrice": faker.commerce.price({ min: 10, max: 500 }) * 1,
        "productImage": faker.image.url(),
      })
    }

    await writeDataFile(path, fileName, products, 'Products')
      .then(( message ) => console.log(message))

    return 'Products successfully created.'

  } catch (err) {
    return new Error('Error creating fake products:', err)
  }
}

module.exports = {
  createFakeProducts
}
