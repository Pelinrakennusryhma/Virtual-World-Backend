const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const usersRouter = require('express').Router()
const User = require('../models/user')
const CharacterData = require('../models/character_data')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})

  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    passwordHash,
  })

  const savedUser = await user.save()

  const characterData = new CharacterData({
    user: savedUser,
    inventory: {
      money: 0
    }
  })

  await characterData.save()

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 60 * 60 }
  )

  response
    .status(201)
    .send({ token, username: user.username, id: user.id })
})

module.exports = usersRouter