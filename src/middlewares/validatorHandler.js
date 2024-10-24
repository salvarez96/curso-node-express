const boom = require('@hapi/boom');

function validatorHandler(schema, property) {
  return (req, res, next) => {
    const data = req[property]

    const { error } = schema.validate(data)

    error ? next(boom.badRequest(error)) : next()
  }
}

module.exports = {
  validatorHandler
}
