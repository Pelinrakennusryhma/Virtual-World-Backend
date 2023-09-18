require('dotenv').config()

const AUTH_PORT = process.env.AUTH_PORT
const DATA_PORT = process.env.DATA_PORT

const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  AUTH_PORT,
  DATA_PORT
}