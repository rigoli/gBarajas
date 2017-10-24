'use sctrict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SucursalSchema = Schema({
  nombreSuc: String,
  encargado: Number
})

module.exports = mongoose.model('sucursal', SucursalSchema)
