const { Router } = require('express');
const { UsersService } = require('@services/users/users.service')
const boom = require('@hapi/boom');
const { validatorHandler } = require('@middlewares/validatorHandler');
const {
  createUserSchema,
  updateUserSchema,
  getUserSchema,
  deleteUserSchema
} = require('@users/users.schema')

const router = Router()
const usersService = new UsersService()

router.get('/', async (req, res, next) => {
  try {
    const { size } = req.query
    const usersList = await usersService.find()
    let filteredUsers = []

    if (size && size < usersList.metadata.totalItems) {
      filteredUsers = usersList.data.splice(0, size)
    } else {
      filteredUsers = usersList.data
    }

    if (filteredUsers.length) {
      return res
        .status(200)
        .json({
          statusCode: 200,
          totalUsers: filteredUsers.length,
          data: filteredUsers
        })
    }
    return res
      .status(204)
      .json({
        statusCode: 204,
        message: `No caegories in the list.`
      })
  } catch (err) {
    next(err)
  }
})

// ruta para filtrar usuarios por id
router.get('/:id',
  validatorHandler(getUserSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params

      const user = await usersService.find(id)

      if (user) {
        res
          .status(200)
          .json({
            statusCode: 200,
            data: user
          })
      } else {
        throw boom.notFound(`No user with id: ${id}`)
      }
    } catch (err) {
      next(err)
    }
  }
)

router.post('/',
  validatorHandler(createUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const { body } = req
      const { data } = await usersService.getUsers()

      // identification number must be unique
      const userExists = data.find(user => user.userIdentificationNumber === body.userIdentificationNumber)
      if (userExists)
        throw boom.badRequest(`Can't create user because the identification number: ${userExists.userIdentificationNumber} already exists.`)

      const newUser = await usersService.create(body)

      return res
        .status(201)
        .json({
          statusCode: 201,
          message: "User created successfully",
          data: await newUser
        })
    } catch (err) {
      next(err)
    }
  }
)

router.patch('/:id',
  validatorHandler(getUserSchema, 'params'),
  validatorHandler(updateUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params
      const { body } = req
      const { data } = await usersService.getUsers()

      // identification number must be unique
      const userExists = data.find(user => user.userIdentificationNumber === body.userIdentificationNumber)
      if (userExists)
        throw boom.badRequest(`Can't create user because the identification number: ${userExists.userIdentificationNumber} already exists.`)

      const user = await usersService.update(id, body)

      if (!user) {
        throw boom.notFound(`The user with id ${id} doesn't exist.`)
      }

      return res
        .status(202)
        .json({
          statusCode: 202,
          message: "User updated successfully",
          data: await user
        })
    } catch (err) {
      next(err)
    }
  }
)

router.delete('/:id',
  validatorHandler(deleteUserSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params

      const user = await usersService.delete(id)

      if (!user) {
        throw boom.notFound(`Unable to delete user with id: ${id}. The user doesn't exist.`)
      }

      return res
        .status(202)
        .json({
          code: 202,
          message: 'User deleted successfully.',
          data: await user
        })
    } catch (err) {
      next(err)
    }
  }
)

module.exports = router
