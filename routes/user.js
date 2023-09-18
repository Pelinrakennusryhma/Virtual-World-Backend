const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userRouter = require('express').Router()
const User = require('../models/user')
const CharacterData = require('../models/character_data')
const Inventory = require('../models/inventory')
const { register } = require('../services/userService')

userRouter.get('/', async (request, response) => {
  const users = await User.find({})

  response.json(users)
})

userRouter.post('/', async (request, response) => {
  const { username, password } = request.body
  const userData = await register(username, password)

  response
    .status(201)
    .send(userData)
})

module.exports = userRouter