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
  let items = inventory.items;

  console.log(inventoryChanges)
  for (let index = 0; index < inventoryChanges.length; index++) {
    const change = inventoryChanges[index];

    // Item exists in inventory
    const foundItem = items.find((item) => item.id == change.itemId);

    let item
    if (change.operation == "ADD") {

      if (!foundItem) { // item doesn't exist, create and set amount
        const newItem = { id: change.itemId, amount: change.amount }
        items.push(newItem);
      } else { // item does exist, increase amount
        foundItem.amount += parseInt(change.amount)
        items = items.map(i => i.id === foundItem.id ? foundItem : i)
      }

    } else if (change.operation == "REMOVE") {

      if (!foundItem || foundItem.amount < change.amount) {
        // if items to remove don't exist, cancel everything and return original inventory
        return inventory;
      }

      foundItem.amount -= parseInt(change.amount)

      // if left with items in inventory, update the amount, otherwise remove it from items
      if (foundItem.amount > 0) {
        items = items.map(i => i.id === foundItem.id ? foundItem : i)
      } else {
        items = items.filter(i => i.id !== foundItem.id)
      }
    }
  }

  const updatedInventory = await Inventory.findByIdAndUpdate(characterData.inventory, { items: items }, { new: true });
  return updatedInventory
}

module.exports = {
  getInventory,
  modifyInventory
}