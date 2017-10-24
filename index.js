'use strict'

const config = require('./config')
const app = require('./app')
const mongoose = require('mongoose')
const mssql = require('mssql')

app.listen(config.serverPort, () => {
  console.log(`NodeJS server iniciado en el puerto: ${config.serverPort}`)

  mssql.connect(config.mssql, () => {
    console.log('Conectado a la Base de Datos Microsft')
  })

  if (config.mongoEnable === true) {
    mongoose.connect(`mongodb://${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.database}`, () => {
      console.log(`Conectado a la Base de Datos Mongo`)
    })
  }
})
