const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const inventoryRouter = require('express').Router()
const User = require('../models/user')
const CharacterData = require('../models/character_data')
const Inventory = require('../models/inventory')
const InventoryItem = require('../models/inventoryItem')

inventoryRouter.get('/:userId', async (request, response) => {
  const userId = request.params.userId
  const characterData = await CharacterData.findOne({ user: userId }).populate("inventory")

  response.json(characterData.inventory);
})

inventoryRouter.patch('/:userId', async (request, response) => {
  const { itemId, itemName, operation, amount } = request.body
  const userId = request.params.userId

  const characterData = await CharacterData.findOne({ user: userId })
  const inventory = await Inventory.findOne({ _id: characterData.inventory }).populate("items")
  const items = inventory.items;
  console.log(items)

  if (operation == "increase") {
    // check if items contains itemId and increase amount
    // otherwise add item and increase amount
    const foundItem = items.find((item) => item.id == itemId);

    if (!foundItem) {
      const newItem = { id: itemId, name: itemName, amount }
      // const newItem = new InventoryItem({ _id: itemId, name: itemName, amount });
      // await newItem.save();
      const updatedInventory = await Inventory.findByIdAndUpdate(characterData.inventory, { $push: { "items": newItem } }, { new: true });
      response
        .status(200)
        .send({ inventory: updatedInventory })
    } else {
      foundItem.amount += parseInt(amount)
      const updatedItems = items.map((item) => item.id === itemId ? item = foundItem : item = item)
      console.log("--------------------")
      console.log(items);
      const updatedInventory = await Inventory.findByIdAndUpdate(characterData.inventory, { items: updatedItems }, { new: true });
      response
        .status(200)
        .send({ inventory: updatedInventory })
    }
  } else if (operation == "decrease") {
    // check if items contains at least amount of itemId items and decrease amount if so
    // if items doesn't contain or contains less than amount, response with failure
  }
  // const filter = { _id: characterData.inventory };
  // const update = { $inc: { itemId: quantityChange } };
  // const updatedInventory = await Inventory.findOneAndUpdate(filter, update, { new: true })



})

module.exports = inventoryRouter