const fs = require('fs');
// const path = require('path');

function createDataDirectory() {
  try {
    const dataDirectoryPath = process.cwd() + '/data'

    if (!fs.existsSync(dataDirectoryPath)) {
      fs.mkdir(dataDirectoryPath, (err) => {
        if (err) {
          return new Error('Error creating path:', err)
        }
      })
    }

    return dataDirectoryPath
  } catch (err) {
    return new Error('Error creating data directory:', err)
  }
}

async function createDataFile(jsonFileName) {
  try {
    const returnObject = {}

    const dataDirectoryPath = createDataDirectory()

    if (typeof dataDirectoryPath !== 'string') return new Error(dataDirectoryPath)

    const jsonPath = dataDirectoryPath + `/${jsonFileName}`
    returnObject.path = jsonPath
    returnObject.fileName = jsonFileName

    if (!fs.existsSync(jsonPath)) {
      fs.writeFile(jsonPath, '[]', (err) => {
        if (err) {
          returnObject.message = 'Error writing data:', err
          return new Error(returnObject.message)
        }
      })

      returnObject.message = `${jsonPath} succesfully created.`
      returnObject.isFileNew = true

      return returnObject
    }

    returnObject.message =  `${jsonPath} already exists.`
    returnObject.isFileNew = false

    return returnObject
  } catch (err) {
    return new Error(`Error creating ${jsonFileName}:`, err)
  }
}

module.exports = {
  createDataFile
}
