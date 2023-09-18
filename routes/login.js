const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const { login } = require('../services/loginService')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body
  const userData = await login(username, password)

  response
    .status(200)
    .send(userData)
})

module.exports = loginRouter