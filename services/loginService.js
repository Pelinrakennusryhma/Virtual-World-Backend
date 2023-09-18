const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const { createError } = require('../utils/errors')
const { createToken } = require('../utils/auth')

login = async (username, password) => {
  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    throw createError('AuthError', 'invalid username or password')
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = createToken(userForToken)

  return { token, username: user.username, id: user.id }
}

module.exports = { login }