const authApp = require('./authApp')
const dataApp = require('./dataApp')
const config = require('./utils/config')
const logger = require('./utils/logger')
require('./InitDatabase')

// globally available server for registering, logging in and authenticating
authApp.listen(config.AUTH_PORT, () => {
  logger.info(`AuthServer running on port ${config.AUTH_PORT}`)
})

// restricted for Unity Dedicated Server for accessing and modifying character data etc.
dataApp.listen(config.DATA_PORT, 'localhost', () => {
  logger.info(`DataServer running on port ${config.DATA_PORT}`)
})
