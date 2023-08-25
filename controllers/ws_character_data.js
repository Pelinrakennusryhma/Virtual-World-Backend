const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const CharacterData = require('../models/character_data')

ParseMessage = async (msg, ws) => {
  var parsedMsg = JSON.parse(msg);

  var response
  // response = await this[msg.type](msg.arg)
  switch (parsedMsg.type) {
    case "GetCharacterData":
      response = await GetCharacterData(parsedMsg.arg);
  }
  console.debug(response)
  ws.send(response)
}

GetCharacterData = async (token) => {
  console.log(token);
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  // const user = await User.findById(decodedToken.id)

  const characterData = await CharacterData.findOne({ user: decodedToken.id })

  return JSON.stringify({ type: "CharacterData", data: JSON.stringify(characterData) })
}

module.exports = ParseMessage