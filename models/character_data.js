const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const characterDataSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  inventory: {
    money: Number
  }
})

characterDataSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('CharacterData', characterDataSchema)

module.exports = User