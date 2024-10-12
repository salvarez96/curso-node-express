function internalError(error, req, res, next) {
  console.error(`Error in the ${req.method} request for ${req.url}:`, error)
  res
    .status(500)
    .json({
      statusCode: 500,
      error: 'Internal server error',
      message: `There was an application error processing the request from ${req.url}`
    })
}

function handleBoomErrors(error, req, res, next) {
  if (error.isBoom) {
    return res.status(error.output.statusCode).json(error.output.payload)
  }

  next(error)
}

module.exports = {
  internalError,
  handleBoomErrors
}
