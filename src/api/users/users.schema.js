const Joi = require('joi');

const id = Joi.number().integer()
const userName = Joi.string().min(3).max(20)
const userAge = Joi.number().positive().min(18).max(90)
const userIdentificationNumber = Joi.number().integer().positive()
const userBirthDate = Joi.date().max(`${2024 - 18}`)
const userBirthCountry = Joi.string()

const createUserSchema = Joi.object({
  userName: userName.required(),
  userAge: userAge.required(),
  userIdentificationNumber: userIdentificationNumber.required(),
  userBirthDate: userBirthDate.required(),
  userBirthCountry: userBirthCountry.required()
})

const updateUserSchema = Joi.object({
  userName: userName,
  userAge: userAge,
  userIdentificationNumber: userIdentificationNumber,
  userBirthDate: userBirthDate,
  userBirthCountry: userBirthCountry
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
