const Joi = require('joi');

const id = Joi.number().integer()
const name = Joi.string().min(3).max(20)
const age = Joi.number().positive().min(18).max(90)
const identificationNumber = Joi.number().integer().positive()
const birthDate = Joi.date().max(`${2024 - 18}`)
const birthCountry = Joi.string()

const createUserSchema = Joi.object({
  name: name.required(),
  age: age.required(),
  identificationNumber: identificationNumber.required(),
  birthDate: birthDate.required(),
  birthCountry: birthCountry.required()
})

const updateUserSchema = Joi.object({
  name: name,
  age: age,
  identificationNumber: identificationNumber,
  birthDate: birthDate,
  birthCountry: birthCountry
})

const getUserSchema = Joi.object({
  id: id.required()
})

const deleteUserSchema = getUserSchema

module.exports = {
  createUserSchema,
  updateUserSchema,
  getUserSchema,
  deleteUserSchema
}
