const inventoryRouter = require('express').Router()
const { GetInventory, AddItem, RemoveItem } = require('../services/inventoryService')
const { createError } = require('../utils/errors')

inventoryRouter.get('/:userId', async (request, response) => {
  const inventory = await GetInventory(request.params.userId)
  if (inventory) {
    response
      .status(400)
      .json(inventory)
  } else {
    throw createError('InventoryError', `Unable to get inventory of UserID ${request.params.userId}`)
  }
})

inventoryRouter.put('/:userId', async (request, response) => {
  const { itemId, itemName, operation, amount } = request.body
  const userId = request.params.userId

  let item
  if (operation == "ADD") {
    item = await AddItem(userId, itemId, itemName, amount)
  } else if (operation == "REMOVE") {
    item = await RemoveItem(userId, itemId, amount)
  }

  if (item) {
    response
      .status(200)
      .json(item)
  } else {
    throw createError('InventoryError', `Unable to modify inventory of UserID ${userId}`)
  }
})

module.exports = inventoryRouter