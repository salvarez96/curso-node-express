const { getDataPath } = require('@helpers/getDataPath')
const { DataFileHandler } = require('@helpers/dataFileHandler')
const { faker } = require('@faker-js/faker');

class UsersService {

  constructor() {
    this.usersPath = getDataPath('users')
  }

  async getUsers () {
    try {
      return await DataFileHandler.readDataFile(this.usersPath)
    } catch (err) {
      throw err
    }
  }

  async create(user) {
    const cleanBody = {
      'name': user.name,
      'age': user.age,
      'identificationNumber': user.identificationNumber,
      'birthDate': user.birthDate,
      'birthCountry': user.birthCountry,
    }

    try {
      const { data, metadata } = await this.getUsers()

      metadata.lastItemId++
      metadata.totalItems++

      user = { id: metadata.lastItemId, ...cleanBody }

      data.push(user)

      await DataFileHandler.writeDataFile('users', { data, metadata }, 'New user')

      return user
    } catch (err) {
      throw err
    }
  }

  async find(userId = undefined) {
    try {
      const users = await this.getUsers()

      userId = userId ? userId * 1 : undefined
      if (typeof userId === 'number' && userId >= 0) {
        const user = users.data.find((user) => {
          return user.id == userId
        })

        return user
      } else if (userId === undefined) {
        return users
      }
      return false
    } catch (err) {
      throw err
    }
  }

  async update(userId, updatedContent) {
    try {
      const { data, metadata } = await this.getUsers()
      const userIndex = data.findIndex(user => user.id == userId)

      if (userIndex < 0) {
        return false
      }

      const user = data[userIndex]

      data[userIndex] = { ...user, ...updatedContent }

      const dataWriteResponse = await DataFileHandler.writeDataFile('users', { data, metadata }, 'User update')
      console.log(dataWriteResponse);

      return data[userIndex]
    } catch (err) {
      throw err
    }
  }

  async delete(userId) {
    try {
      const { data, metadata } = await this.getUsers()
      const userIndex = data.findIndex(user => user.id == userId)

      if (userIndex < 0) {
        return false
      }

      const deletedUser = data.splice(userIndex, 1)
      metadata.totalItems--

      const dataWriteResponse = await DataFileHandler.writeDataFile('users', { data, metadata }, 'User delete')
      console.log(dataWriteResponse);

      return deletedUser
    } catch (err) {
      throw err
    }
  }
}

module.exports = {
  UsersService
}
