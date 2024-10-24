const { getDataPath } = require('@helpers/getDataPath')
const { DataFileHandler } = require('../../helpers/dataFileHandler')
const { faker } = require('@faker-js/faker');

class ProductsService {

  constructor() {
    this.productsPath = getDataPath('products')
  }

  async getProducts () {
    try {
      return await DataFileHandler.readDataFile(this.productsPath)
    } catch (err) {
      throw err
    }
  }

  async create(product) {
    const cleanBody = {
      'productName': product.productName,
      'productPrice': product.productPrice,
      'productImage': faker.image.url()
    }

    try {
      const { data, metadata } = await this.getProducts()

      metadata.lastItemId++
      metadata.totalItems++

      product = { id: metadata.lastItemId, ...cleanBody }

      data.push(product)

      await DataFileHandler.writeDataFile('products', { data, metadata }, 'New product')

      return product
    } catch (err) {
      throw err
    }
  }

  async find(productId = undefined) {
    try {
      const products = await this.getProducts()

      productId = productId ? productId * 1 : undefined
      if (typeof productId === 'number' && productId >= 0) {
        const product = products.data.find((product) => {
          return product.id == productId
        })

        return product
      } else if (productId === undefined) {
        return products
      }
      return false
    } catch (err) {
      throw err
    }
  }

  async update(productId, updatedContent) {
    try {
      const { data, metadata } = await this.getProducts()
      const productIndex = data.findIndex(product => product.id == productId)

      if (productIndex < 0) {
        return false
      }

      const product = data[productIndex]

      data[productIndex] = { ...product, ...updatedContent}

      const dataWriteResponse = await DataFileHandler.writeDataFile('products', { data, metadata }, 'Product update')
      console.log(dataWriteResponse);

      return data[productIndex]
    } catch (err) {
      throw err
    }
  }

  async delete(productId) {
    try {
      const { data, metadata } = await this.getProducts()
      const productIndex = data.findIndex(product => product.id == productId)

      if (productIndex < 0) {
        return false
      }

      const deletedProduct = data.splice(productIndex, 1)
      metadata.totalItems--

      const dataWriteResponse = await DataFileHandler.writeDataFile('products', { data, metadata }, 'Product delete')
      console.log(dataWriteResponse);

      return deletedProduct
    } catch (err) {
      throw err
    }
  }
}

module.exports = {
  ProductsService
}
