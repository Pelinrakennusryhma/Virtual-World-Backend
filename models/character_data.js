const mongoose = require('mongoose')
const Inventory = require('./inventory')

const characterDataSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  inventory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory'
  }
})

characterDataSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const CharacterData = mongoose.model('CharacterData', characterDataSchema)

module.exports = CharacterData