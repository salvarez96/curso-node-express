const syncFs = require('fs')
const fs = require('fs').promises

class DataFileHandler {

  static async createDataDirectory() {
    try {
      const dataDirectoryPath = process.cwd() + '/data'

      if (!syncFs.existsSync(dataDirectoryPath)) {
        await fs.mkdir(dataDirectoryPath)
        return dataDirectoryPath
      }

      return dataDirectoryPath
    } catch (error) {
      console.error('Error creating data folder:')
      throw error
    }
  }

  static async writeDataFile(pathName, fileName, content, contentType) {
    try {
      await fs.writeFile(pathName, JSON.stringify(content, null, 2))
      return `${contentType} created and registered successfully in data/${fileName}`

    } catch (error) {
      console.error(`Error writing data into ${fileName}`)
      throw error
    }
  }

  static async handleJsonFile(jsonFileName, content, contentType) {
    try {

      const fileName = `${jsonFileName}.json`
      const pathName = `${await this.createDataDirectory()}/${fileName}`

      if (syncFs.existsSync(pathName)) {
        return `Because ${fileName} already exists, it won't be overwritten.`
      }

      return await this.writeDataFile(pathName, fileName, content, contentType)
    } catch (error) {
      console.error(`Error handling ${jsonFileName}.json file:`)
      throw error
    }
  }
}

module.exports = {
  DataFileHandler
}
