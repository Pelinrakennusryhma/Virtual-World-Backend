const User = require('../models/user')
const jwt = require('jsonwebtoken')

const createToken = (userForToken) => {
  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 60 * 60 }
  )

  return token
}

module.exports = {
  createToken
};

