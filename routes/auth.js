const authRouter = require('express').Router()
const { authUserFromToken } = require('../services/authService')

authRouter.post('/', async (request, response) => {

  const userData = await authUserFromToken(request)

  response.json(userData)
})

module.exports = authRouter