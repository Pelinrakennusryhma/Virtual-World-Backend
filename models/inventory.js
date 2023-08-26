const mongoose = require('mongoose')

const inventorySchema = mongoose.Schema({
  money: Number
})

inventorySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Inventory = mongoose.model('Inventory', inventorySchema)

module.exports = Inventory