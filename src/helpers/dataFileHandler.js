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
    options = {
      contentType: '',
      hasMetadata: false
    }
  ) {
    try {
      const filePath = getDataPath(fileName)

      if (options.hasMetadata) {
        const data = await this.readDataFile(filePath)

        data.metadata.lastItemId += 1
        data.metadata.totalItems += 1

        // add id to new item
        content = { id: data.metadata.lastItemId, ...content }

        data.data.push(content)

        await fs.writeFile(filePath, JSON.stringify(data, null, 2))
        return {
          data: content,
          message: `${fileName} has been successfully edited.`
        }
      }

      await fs.writeFile(filePath, JSON.stringify(content, null, 2))
      return `${options.contentType} created and registered successfully in data/${fileName}.json`

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
        lastItemId: content.length  - 1,
        totalItems: content.length
      }

      // only content in data property will be shown to user. Metadata will ease up app related processing
      const contentBody = {
        data: content,
        metadata: contentMetadata
      }

      return await this.writeDataFile(jsonFileName, contentBody, { contentType: contentType })
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
