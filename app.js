const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authRouter = require('./controllers/auth')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const AuthSuperUser = require('./utils/auth_super_user')
const ParseMessage = require('./controllers/ws_character_data')

var expressWs = require('express-ws')(app);

mongoose.set('strictQuery', false)

logger.info('connecting to db')

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.ws('/', (ws, req) => {
  ws.on('message', msg => {
    // console.log(msg);
    ParseMessage(msg, ws)
    // ws.send(msg)

  })
  ws.on('close', () => {
    console.log('WebSocket was closed')
  })
})

expressWs.getWss().on('connection', async function (ws, req) {

  const user = req.get("user-agent")
  if (user) {
    const isSuperUser = await AuthSuperUser(user)
    if (isSuperUser) {
      console.log("ACCESS GRANTED");
    } else {
      console.log("ACCESS DENIED")
      ws.close(1000, "unauthorized")
    }
  } else {
    console.log("ACCESS DENIED")
    ws.close(1000, "unauthorized")
  }

});

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/auth', authRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app