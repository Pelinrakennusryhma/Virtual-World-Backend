const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const inventoryRouter = require('./routes/inventory')
const characterRouter = require('./routes/character')
const middleware = require('./utils/middleware')

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/inventory', inventoryRouter)
app.use('/api/character', characterRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app