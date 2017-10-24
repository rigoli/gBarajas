'use strict'

const express = require('express')
const bodyParser = require('body-parser')

const usersRoute = require('./routes/users')
const sucsRoute = require('./routes/sucursales')
const tanquesRoute = require('./routes/tanques')
const compraCombustiblesRoute = require('./routes/compraCombustibles')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/api', usersRoute)
app.use('/api', sucsRoute)
app.use('/api', tanquesRoute)
app.use('/api', compraCombustiblesRoute)

module.exports = app
