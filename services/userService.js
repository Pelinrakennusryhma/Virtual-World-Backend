const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userRouter = require('express').Router()
const User = require('../models/user')
const CharacterData = require('../models/character_data')
const Inventory = require('../models/inventory')
const { createToken } = require('../utils/auth')

const register = async (username, password) => {

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    passwordHash,
  })

  const savedUser = await user.save()

  const inventory = new Inventory()
  await inventory.save()

  const characterData = new CharacterData({
    user: savedUser,
    inventory: inventory
  })
  await characterData.save()

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = createToken(userForToken)

  return { token, username: user.username, id: user.id }
}

module.exports = { register }