const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const userRouter = require('./routes/user')
const loginRouter = require('./routes/login')
const authRouter = require('./routes/auth')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const { authSuperUser } = require('./utils/auth')
const ParseMessage = require('./routes/ws_character_data')

var expressWs = require('express-ws')(app);

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
    const isSuperUser = await authSuperUser(user)
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

app.use('/api/user', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/auth', authRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app