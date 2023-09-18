const characterRouter = require('express').Router()
const { getCharacterData } = require('../services/characterService')

characterRouter.get('/:userId', async (request, response) => {
  const user = await getCharacterData(request.params.userId)

  response.status(200).json(user)
})


module.exports = characterRouter