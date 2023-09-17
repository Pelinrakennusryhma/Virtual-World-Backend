const inventoryRouter = require('express').Router()
const { GetInventory, AddItem, RemoveItem } = require('../services/inventoryService')

inventoryRouter.get('/:userId', async (request, response) => {
  const inventory = await GetInventory(request.params.userId)
  if (inventory) {
    response
      .status(400)
      .json(inventory)
  } else {
    response.status(401).json({
      error: 'unable to get inventory'
    })
  }

})

inventoryRouter.patch('/:userId', async (request, response) => {
  const { itemId, itemName, operation, amount } = request.body
  const userId = request.params.userId

  let item
  if (operation == "add") {
    item = await AddItem(userId, itemId, itemName, amount)
  } else if (operation == "remove") {
    item = await RemoveItem(userId, itemId, amount)
  }

  if (item) {
    response
      .status(200)
      .json(item)
  } else {
    response
      .status(400)
      .json({ error: 'error modifying item amount in inventory' })
  }
})

module.exports = inventoryRouter