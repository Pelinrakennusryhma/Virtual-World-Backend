const CharacterData = require('../models/character_data')

getCharacterData = async (id) => {
  const characterData = await CharacterData.findOne({ user: id }).populate("inventory").populate("user")
  return characterData;
}

module.exports = { getCharacterData }