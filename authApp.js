const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const userRouter = require('./routes/user')
const loginRouter = require('./routes/login')
const authRouter = require('./routes/auth')
const middleware = require('./utils/middleware')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/user', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/auth', authRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app