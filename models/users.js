'use sctrict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = Schema({
  idSuc: Number,
  name: String,
  lastname: String,
  email: {
    type: String,
    require: () => {
      this.indexOf('@')
    }
  },
  password: { type: String, select: false },
  privilege: { type: Number, default: 2 }
})

module.exports = mongoose.model('user', UserSchema)
