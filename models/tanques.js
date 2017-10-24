'use sctrict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TanqueSchema = Schema({
  idSuc: Number,
  idCom: Number
})

module.exports = mongoose.model('tanque', TanqueSchema)
