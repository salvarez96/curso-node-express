const { getDataPath } = require('@helpers/getDataPath')
const { DataFileHandler } = require('@helpers/dataFileHandler')
const { faker } = require('@faker-js/faker');

class CategoriesService {

  constructor() {
    this.categoriesPath = getDataPath('categories')
  }

  async getCategories () {
    try {
      return await DataFileHandler.readDataFile(this.categoriesPath)
    } catch (err) {
      throw err
    }
  }

  async create(category) {
    const cleanBody = {
      'name': category.name,
      'description': category.description,
      'image': faker.image.url()
    }

    try {
      const { data, metadata } = await this.getCategories()

      metadata.lastItemId++
      metadata.totalItems++

      category = { id: metadata.lastItemId, ...cleanBody }

      data.push(category)

      await DataFileHandler.writeDataFile('categories', { data, metadata }, 'New category')

      return category
    } catch (err) {
      throw err
    }
  }

  async find(categoryId = undefined) {
    try {
      const categories = await this.getCategories()

      categoryId = categoryId ? categoryId * 1 : undefined
      if (typeof categoryId === 'number' && categoryId >= 0) {
        const category = categories.data.find((category) => {
          return category.id == categoryId
        })

        return category
      } else if (categoryId === undefined) {
        return categories
      }
      return false
    } catch (err) {
      throw err
    }
  }

  async update(categoryId, updatedContent) {
    try {
      const { data, metadata } = await this.getCategories()
      const categoryIndex = data.findIndex(category => category.id == categoryId)

      if (categoryIndex < 0) {
        return false
      }

      const category = data[categoryIndex]

      data[categoryIndex] = { ...category, ...updatedContent }

      const dataWriteResponse = await DataFileHandler.writeDataFile('categories', { data, metadata }, 'Category update')
      console.log(dataWriteResponse);

      return data[categoryIndex]
    } catch (err) {
      throw err
    }
  }

  async delete(categoryId) {
    try {
      const { data, metadata } = await this.getCategories()
      const categoryIndex = data.findIndex(category => category.id == categoryId)

      if (categoryIndex < 0) {
        return false
      }

      const deletedCategory = data.splice(categoryIndex, 1)
      metadata.totalItems--

      const dataWriteResponse = await DataFileHandler.writeDataFile('categories', { data, metadata }, 'Category delete')
      console.log(dataWriteResponse);

      return deletedCategory
    } catch (err) {
      throw err
    }
  }
}

module.exports = {
  CategoriesService
}
