const characterRouter = require('express').Router()
const { getCharacterData,
  addActiveQuestData,
  deleteActiveQuestData,
  deleteAllActiveQuestData,
  addCompletedQuestData,
  deleteAllCompletedQuestData } = require('../services/characterService')

characterRouter.get('/:userId', async (request, response) => {
  const user = await getCharacterData(request.params.userId)

  response.status(200).json(user)
})

characterRouter.post('/:userId/quests/active-quests', async (request, response) => {
  const params = request.body
  params.userId = request.params.userId
  params.questId = request.body.id
  const data = await addActiveQuestData(params)

  response.status(200).json(data)
})

characterRouter.delete('/:userId/quests/active-quests/', async (request, response) => {
  const params = request.body
  params.userId = request.params.userId;
  params.questId = request.body.id
  const data = await deleteActiveQuestData(params)

  response.status(200).json(data)
})

characterRouter.delete('/:userId/quests/active-quests/reset-all', async (request, response) => {
  const data = await deleteAllActiveQuestData(request.params.userId)

  response.status(200).json(data)
})

characterRouter.post('/:userId/quests/completed-quests', async (request, response) => {
  const params = request.body
  params.userId = request.params.userId;
  params.questId = request.body.id
  const data = await addCompletedQuestData(params)

  response.status(200).json(data)
})

characterRouter.delete('/:userId/quests/completed-quests/reset-all', async (request, response) => {
  const data = await deleteAllCompletedQuestData(request.params.userId)

  response.status(200).json(data)
})

module.exports = characterRouter