const { faker } = require('@faker-js/faker')
const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '..', '/data/products.json')

async function createFakeProducts(quantity = 20) {
  const products = []

  for (let index = 0; index < quantity; index++) {
    products.push({
      "productId": index,
      "productName": faker.commerce.product(),
      "productPrice": faker.commerce.price({ min: 10, max: 500 }) * 1,
      "productImage": faker.image.url(),
    })
  }

  return new Promise((res, rej) => {
    fs.writeFile(productsPath, JSON.stringify(products, null, 2), (err) => {
      if (err) {
        console.log('error', err);
        rej([])
        throw new Error('Error writing data:', err)
      }
    })

    res(products)
  })
}

module.exports = {
  createFakeProducts
}
