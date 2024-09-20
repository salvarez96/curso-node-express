const fs = require('fs');

function writeDataFile(path, fileName, content, contentType) {
  return new Promise(( res, rej ) => {
    fs.writeFile(path, JSON.stringify(content, null, 2), (err) => {
      if (err) {
        rej('Error writing data', err)
      }

      res(`${contentType} created and registered successfully in data/${fileName}`)
    })
  })
}

module.exports = {
  writeDataFile
}
