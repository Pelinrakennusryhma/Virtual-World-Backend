const { createError } = require('../utils/errors')
const CharacterData = require('../models/character_data')
const Inventory = require('../models/inventory')

const getInventory = async (userId) => {
  const characterData = await CharacterData.findOne({ user: userId }).populate("inventory")
  return characterData.inventory;
}

const modifyInventory = async (userId, inventoryChanges) => {
  const characterData = await CharacterData.findOne({ user: userId })
  const inventory = await Inventory.findOne({ _id: characterData.inventory }).populate("items")
  const items = inventory.items;

  const modifiedItems = []

  console.log(inventoryChanges)
  for (let index = 0; index < inventoryChanges.length; index++) {
    const change = inventoryChanges[index];

    // Item exists in inventory
    const foundItem = items.find((item) => item.id == change.itemId);

    let item
    if (change.operation == "ADD") {

      if (!foundItem) { // item doesn't exist, create and set amount
        const newItem = { id: change.itemId, amount: change.amount }
        modifiedItems.push(newItem);
      } else { // item does exist, increase amount
        foundItem.amount += parseInt(change.amount)
        modifiedItems.push(foundItem)
      }

    } else if (change.operation == "REMOVE") {

      if (!foundItem || foundItem.amount < change.amount) {
        // if items to remove don't exist, cancel everything and return original inventory
        return inventory;
      }

      foundItem.amount -= parseInt(change.amount)

      // if left with items in inventory, update the amount
      if (foundItem.amount > 0) {
        modifiedItems.push(foundItem)
      }
    }
  }


  const updatedInventory = await Inventory.findByIdAndUpdate(characterData.inventory, { items: modifiedItems }, { new: true });
  return updatedInventory
}

const addItem = async (userId, itemId, itemName, amount) => {
  const characterData = await CharacterData.findOne({ user: userId })
  const inventory = await Inventory.findOne({ _id: characterData.inventory }).populate("items")
  const items = inventory.items;

  const foundItem = items.find((item) => item.id == itemId);

  // item doesn't exist in inventory, add amount items
  if (!foundItem) {
    const newItem = { id: itemId, name: itemName, amount }
    await Inventory.findByIdAndUpdate(characterData.inventory, { $push: { "items": newItem } }, { new: true });
    return newItem;
    // item does exist, increase amount
  } else {
    foundItem.amount += parseInt(amount)
    const updatedItems = items.map((item) => item.id === itemId ? item = foundItem : item = item)
    const updatedInventory = await Inventory.findByIdAndUpdate(characterData.inventory, { items: updatedItems }, { new: true });
    return updatedInventory.items.find(i => i.id === itemId)
  }
}

const removeItem = async (userId, itemId, amount) => {
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
      throw createError('InventoryError', `Can't remove ${amount} of ItemID ${itemId} as only ${foundItem.amount} are in inventory`)
    }
  } else {
    throw createError('InventoryError', `No ItemID ${itemId} found in inventory to be removed`)
  }
}

module.exports = {
  getInventory,
  modifyInventory
}