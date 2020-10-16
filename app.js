const express = require('express')
const app = express()
const apiPlayersRoute = require('./routes/apiPlayers')
const authRoute = require('./routes/auth')
const middleware = require('./utils/middleware')
const passport = require('./lib/passport')

app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(passport.initialize())
app.use('/api', apiPlayersRoute)
app.use('/', authRoute)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app