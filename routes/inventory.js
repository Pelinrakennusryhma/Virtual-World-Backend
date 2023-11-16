const inventoryRouter = require('express').Router()
const { getInventory, modifyInventory } = require('../services/inventoryService')
const { createError } = require('../utils/errors')

inventoryRouter.get('/:userId', async (request, response) => {
  const inventory = await getInventory(request.params.userId)
  if (inventory) {
    response
      .status(400)
      .json(inventory)
  } else {
    throw createError('InventoryError', `Unable to get inventory of UserID ${request.params.userId}`)
  }
})

inventoryRouter.put('/:userId', async (request, response) => {
  // const { itemId, itemName, operation, amount } = request.body
  const { inventoryChanges } = request.body
  const userId = request.params.userId

  const modifiedInventory = await modifyInventory(userId, inventoryChanges)

  if (modifiedInventory) {
    response
      .status(200)
      .json(modifiedInventory)
  } else {
    throw createError('InventoryError', `Unable to modify inventory of UserID ${userId}`)
  }

  // let item
  // if (operation == "ADD") {
  //   item = await addItem(userId, itemId, itemName, amount)
  // } else if (operation == "REMOVE") {
  //   item = await removeItem(userId, itemId, amount)
  // }

  // if (item) {
  //   response
  //     .status(200)
  //     .json(item)
  // } else {
  //   throw createError('InventoryError', `Unable to modify inventory of UserID ${userId}`)
  // }
})

module.exports = inventoryRouter