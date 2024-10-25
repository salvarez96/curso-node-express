require('module-alias/register')
const { faker } = require('@faker-js/faker')
const { DataFileHandler } = require('@helpers/dataFileHandler')
const generateRandomInteger = require('@helpers/generateRandomInteger')

function userIdentificationNumberGenerator(userAge) {
  const firstNumber = userAge < 40 ? 1 : generateRandomInteger(2, 9).int
  const maxIdentificationNumberLength =
    firstNumber === 1
      ? 9
      : userAge > 70
        ? 5
        : 7

  let identificationNumber = `${firstNumber}`

  for (let i = 0 ; i < maxIdentificationNumberLength ; i++) {
    const randomIndex = Math.floor(Math.random() * 10)
    identificationNumber += randomIndex
  }

  return identificationNumber * 1
}

async function createFakeUsers(quantity = 8) {
  try {
    const users = []

    for (let index = 0; index < quantity; index++) {
      const userAge = faker.number.int({
        min: 18,
        max: 90
      })
      users.push({
        "id": index,
        "userName": faker.person.fullName(),
        "userAge": userAge,
        "userIdentificationNumber": userIdentificationNumberGenerator(userAge),
        "userBirthDate": `${2024 - userAge}-${generateRandomInteger(1, 12).parseToDoubleDigits()}-${generateRandomInteger(1, 30).parseToDoubleDigits()}`,
        "userBirthCountry": faker.location.country(),
      })
    }

    return await DataFileHandler.handleJsonFile('users', users, 'Users')

  } catch (error) {
    console.error(`Error registering fake users:`)
    throw error
  }
}

module.exports = {
  createFakeUsers
}
