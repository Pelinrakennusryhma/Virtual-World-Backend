const User = require('../models/user')
const jwt = require('jsonwebtoken')

const AuthSuperUser = async (token) => {
  const decodedToken = jwt.verify(token, process.env.SECRET)
  const user = await User.findById(decodedToken.id)

  if (user.superUser) {
    return true
  }
  else {
    return false
  }
}

module.exports = AuthSuperUser;

