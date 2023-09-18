const User = require('../models/user')
const jwt = require('jsonwebtoken')

const authSuperUser = async (token) => {
  const decodedToken = jwt.verify(token, process.env.SECRET)
  const user = await User.findById(decodedToken.id)

  // temporary while switching to FishNEt
  return true

  // if (user.superUser) {
  //   return true
  // }
  // else {
  //   return false
  // }
}

const createToken = (userForToken) => {
  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 60 * 60 }
  )

  return token
}

module.exports = {
  authSuperUser,
  createToken
};

