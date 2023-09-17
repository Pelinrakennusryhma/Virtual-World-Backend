const inventoryRouter = require('express').Router()
const { CreateError } = require('../utils/errors')
const CharacterData = require('../models/character_data')
const Inventory = require('../models/inventory')

const GetInventory = async (userId) => {
  const characterData = await CharacterData.findOne({ user: userId }).populate("inventory")
  return characterData.inventory;
}

const AddItem = async (userId, itemId, itemName, amount) => {
  const characterData = await CharacterData.findOne({ user: userId })
  const inventory = await Inventory.findOne({ _id: characterData.inventory }).populate("items")
  const items = inventory.items;

  const foundItem = items.find((item) => item.id == itemId);

  // item doesn't exist in inventory, add amount items
  if (!foundItem) {
    const newItem = { id: itemId, name: itemName, amount }
    const updatedInventory = await Inventory.findByIdAndUpdate(characterData.inventory, { $push: { "items": newItem } }, { new: true });
    return newItem;
    // item does exist, increase amount
  } else {
    foundItem.amount += parseInt(amount)
    const updatedItems = items.map((item) => item.id === itemId ? item = foundItem : item = item)
    const updatedInventory = await Inventory.findByIdAndUpdate(characterData.inventory, { items: updatedItems }, { new: true });
    return updatedInventory.items.find(i => i.id === itemId)
  }
}

const RemoveItem = async (userId, itemId, amount) => {
  const characterData = await CharacterData.findOne({ user: userId })
  const inventory = await Inventory.findOne({ _id: characterData.inventory }).populate("items")
  const items = inventory.items;

  const foundItem = items.find((item) => item.id == itemId);
  if (foundItem) {
    // enough items to remove exist
    if (foundItem.amount >= amount) {
      foundItem.amount -= parseInt(amount)
      const updatedItems = items.map((item) => item.id === itemId ? item = foundItem : item = item)
      const updatedInventory = await Inventory.findByIdAndUpdate(characterData.inventory, { items: updatedItems }, { new: true });
      return updatedInventory.items.find(i => i.id === itemId)
    } else {
      throw CreateError('InventoryError', `Can't remove ${amount} of ItemID ${itemId} as only ${foundItem.amount} are in inventory`)
    }
  } else {
    throw CreateError('InventoryError', `No ItemID ${itemId} found in inventory to be removed`)
  }
}

module.exports = {
  GetInventory,
  AddItem,
  RemoveItem
}