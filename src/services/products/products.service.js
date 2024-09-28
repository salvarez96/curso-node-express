const { getDataPath } = require('@helpers/getDataPath')
const { DataFileHandler } = require('../../helpers/dataFileHandler')
const { faker } = require('@faker-js/faker');

class ProductsService {

  constructor() {
    this.productsPath = getDataPath('products')
    this.products = this.getProducts()
  }

  async getProducts () {
    try {
      return this.products = await DataFileHandler.readDataFile(this.productsPath)
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
      this.products.metadata.lastItemId++
      this.products.metadata.totalItems++

      product = { id: this.products.metadata.lastItemId, ...cleanBody }

      this.products.data.push(product)

      await DataFileHandler.writeDataFile('products', this.products, 'New product')

      return product
    } catch (err) {
      throw err
    }
  }

  async find(productId = undefined) {
    try {
      productId = productId ? productId * 1 : undefined
      if (typeof productId === 'number' && productId >= 0) {
        const product = await this.products.data.find((product) => {
          return product.id == productId
        })

        return product
      } else if (productId === undefined) {
        return this.products
      }
      return false
    } catch (err) {
      throw err
    }
  }

  async update(productId, updatedContent, acceptedPropertyList) {
    try {
      const productIndex = this.products.data.findIndex(product => product.id == productId)

      if (productIndex < 0) {
        return false
      }

      const product = this.products.data[productIndex]

      const acceptedNewProperties = {}

      acceptedPropertyList.forEach(property => {
        if (updatedContent[property]) {
          acceptedNewProperties[property] = updatedContent[property]
        }
      })

      if (!Object.keys(acceptedNewProperties).length) {
        return null
      }

      const updatedProduct = {...product, ...acceptedNewProperties}

      this.products.data[productIndex] = updatedProduct

      const dataWriteResponse = await DataFileHandler.writeDataFile('products', this.products, 'Product update')
      console.log(dataWriteResponse);

      return updatedProduct
    } catch (err) {
      throw err
    }
  }

  async delete(productId) {
    try {
      const productIndex = this.products.data.findIndex(product => product.id == productId)

      if (productIndex < 0) {
        return false
      }

      const deletedProduct = this.products.data.splice(productIndex, 1)
      this.products.metadata.totalItems--

      const dataWriteResponse = await DataFileHandler.writeDataFile('products', this.products, 'Product delete')
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
