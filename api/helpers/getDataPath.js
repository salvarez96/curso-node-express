function getDataPath(fileName) {
  return `${process.cwd()}/data/${fileName}.json`
}

module.exports = {
  getDataPath
}
