'use strict'

const config = require('../config')
const mssql = require('mssql')
const Users = require('../models/users')

function compraCombustible (email) {
  var queryCheckUsr = `SELECT email FROM users WHERE email = '${email}';`
  // VER SI ES NECESARIO HACER LA CONSULTA EN MONGODB

  return new Promise(function (resolve, reject) {
    new mssql.Request().query(queryCheckUsr, (err, result) => {
      resolve(result.rowsAffected)
    })
  })
}

function getCompraCombustible () {
  //
  return
}



function getComprasCombustible() {
  //
  return
}



function updateCompraCombustible() {
  //
  return
}



function deleteCompraCombustible() {
  //
  return
}

module.exports = {
  compraCombustible,
  getCompraCombustible,
  getComprasCombustible,
  updateCompraCombustible,
  deleteCompraCombustible
}
