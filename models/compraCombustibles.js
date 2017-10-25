'use sctrict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const compraCombustibleSchema = Schema({
  idUsr: Number,
  idSuc: Number,
  idTan: Number,
  litros: Number,
  importe: Number,
  factura: Number,
  hraAumento: Date
})

module.exports = mongoose.model('compraCombustible', compraCombustibleSchema)
