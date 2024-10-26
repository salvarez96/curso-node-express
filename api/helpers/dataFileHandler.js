const syncFs = require('fs')
const fs = require('fs').promises
const { getDataPath } = require('@helpers/getDataPath')

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

  static async writeDataFile(
    fileName,
    content,
    contentType
  ) {
    try {
      const filePath = getDataPath(fileName)

      await fs.writeFile(filePath, JSON.stringify(content, null, 2))
      return `${contentType} registered successfully in data/${fileName}.json`

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

      // add a metadata object to every json data file
      const contentMetadata = {
        lastItemId: content.length - 1,
        totalItems: content.length
      }

      // only content in data property will be shown to user. Metadata will ease up app related processing
      const contentBody = {
        data: content,
        metadata: contentMetadata
      }

      return await this.writeDataFile(jsonFileName, contentBody, contentType)
    } catch (error) {
      console.error(`Error handling ${jsonFileName}.json file:`)
      throw error
    }
  }

  static async readDataFile(pathName) {
    try {
      const data = await fs.readFile(pathName, { encoding: 'utf-8' })
      return JSON.parse(data)
    } catch (err) {
      console.error(`Error trying to read data from ${pathName}:`, err);
      throw err
    }
  }
}

module.exports = {
  DataFileHandler
}
