const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const CharacterData = require('../models/character_data')
const Inventory = require('../models/inventory')

ParseMessage = async (msg, ws) => {
  var parsedMsg = JSON.parse(msg);
  var response
  switch (parsedMsg.type) {
    case "GetCharacterData":
      response = await GetCharacterData(parsedMsg.arg);
      break;
    case "AddMoneyToCharacter":
      response = await AddMoneyToCharacter(parsedMsg.arg);
      break;
  }
  console.debug(response)
  ws.send(response)
}

GetCharacterData = async (id) => {
  const characterData = await CharacterData.findOne({ user: id }).populate("inventory")
  return JSON.stringify({ type: "CharacterData", data: JSON.stringify(characterData) })
}

AddMoneyToCharacter = async (args) => {

  const parsedArgs = JSON.parse(args);
  console.debug(parsedArgs);
  const userId = parsedArgs[0]
  const amount = parsedArgs[1]

  const characterData = await CharacterData.findOne({ user: userId })
  const filter = { _id: characterData.inventory };
  const update = { $inc: { money: amount } };
  await Inventory.findOneAndUpdate(filter, update, { new: true })

  const updatedCharacterData = await CharacterData.findOne({ user: userId }).populate("inventory")
  // return JSON.stringify({ type: "Inventory", data: JSON.stringify({ inventory: inventory.toJSON(), user: userId }) })
  return JSON.stringify({ type: "CharacterData", data: JSON.stringify(updatedCharacterData) })
}

module.exports = ParseMessage