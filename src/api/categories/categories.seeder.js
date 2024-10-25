require('module-alias/register')
const { faker } = require('@faker-js/faker')
const { DataFileHandler } = require('@helpers/dataFileHandler')

async function createFakeCategories(quantity = 5) {
  try {
    const categories = []

    for (let index = 0; index < quantity; index++) {
      categories.push({
        "id": index,
        "categoryName": faker.commerce.department(),
        "categoryDescription": faker.commerce.productDescription(),
        "categoryImage": faker.image.url(),
      })
    }

    return await DataFileHandler.handleJsonFile('categories', categories, 'Categories')

  } catch (error) {
    console.error(`Error registering fake categories:`)
    throw error
  }
}

module.exports = {
  createFakeCategories
}
