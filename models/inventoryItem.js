const mongoose = require('mongoose')

const inventoryItemSchema = mongoose.Schema({
  _id: String,
  name: String,
  quantity: String,
});

inventoryItemSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema)

module.exports = InventoryItem