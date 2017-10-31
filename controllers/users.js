'use strict'

const config = require('../config')
const mssql = require('mssql')
const Users = require('../models/users')

function existEmail (email) {
  const queryCheckUsr = `SELECT email FROM users WHERE email = '${email}';`

  return new Promise(function (resolve, reject) {
    new mssql.Request().query(queryCheckUsr, (err, result) => {
      resolve(result.rowsAffected)
    })
  })
}

function getUsrInfo(idUser) {
  let queryUsr = `SELECT idSuc, usrName, lastname, email, usrPassword, dateCreate, privilege FROM users WHERE idUsr = ${config.userTest};`

  return new Promise((resolve, reject) => {
    new mssql.Request().query(queryUsr, (err, result) => {
      resolve(result.recordsets[0][0])
    })
  })
}

function addUser (req, res) {
  const body = req.body

  const user = new Users({
    idSuc: body.idSuc,
    name: body.name,
    lastname: body.lastname,
    email: body.email,
    password: body.password,
    privilege: body.privilege
  })

  // GUARDANDO EL USUARIO EN MSSQL
  existEmail(user.email).then((exist) => {
    if (exist == false) {
      let queryInsert = `
      INSERT INTO [dbo].[users] ([idSuc], [usrname], [lastname], [email], [usrpassword], [dateCreate], [privilege])
        VALUES
      ('${user.idSuc}','${user.name}', '${user.lastname}', '${user.email}', '${user.password}', GETDATE(), '${user.privilege}');`

      new mssql.Request().query(queryInsert, (err, result) => {
        if (err) {
          res.status(500).send({ err, message: 'Error de consulta.', query: queryInsert })
        }

        if (result.rowsAffected == true) {

          if (config.mongoEnable === true) {
            // UNA VEZ REGISTRADO EN SQL SERVER, EL USUARIO SE REGISTRA EN MONGDB PARA FUTURAS CONSULTAS
            // GUARDANDO EL USUARIO EN MONGODB
            user.save((err, userStored) => {
              if (err) return res.status(500).send({ error: `Hubo un error: ${err}. MONGODB` })
              if (!userStored) return res.status(400).send({ error: 'No se guardó el usuario. MONGODB' })
            })
          // TERMINA MONGODB
          }
          res.status(201).send({ message: 'El usuario ha sido registrado' })
        }
      })
    } else {
      res.status(409).send({ message: 'Este correo ya existe, prueba uno diferente o contacte con el administrador.' })
    }
  }).catch(function (err) {
    res.status(500).send({ error: err, message: 'Error en la promesa - "existEmail".' })
  })
  // MSSQL TERMINA
}

function getUser (req, res) {
  const userId = req.params.id

  if (config.defaultDB == "mongodb") {
    Users.findById(userId, (err, userId) => {
      if (err) {
        res.status(500).send({ message: 'Error al devolver el marcador' })
      } else {
        if (!userId) {
          res.status(404).send({ message: 'El usuario no existe' })
        } else {
          res.status(200).send({ userId })
        }
      }
    })
  } else if (config.defaultDB == "mssql") {
    let mssqlQuery = `SELECT * FROM users WHERE idUsr = ${userId} AND del = 0;`

    new mssql.Request().query(mssqlQuery, (err, result) => {
      if (err) {
        res.status(500).send({ error: err.originalError.info.message, message: 'Error al devolver el usuario' })
        return
      }

      if (result.rowsAffected === 0) {
        res.status(404).send({ message: 'No se encontro el usuario' })
        return
      }

      res.status(200).send(result.recordset)
    })
  }
}

function getUsers (req, res) {
  if (config.defaultDB == "mongodb") {
    Users.find({}).sort('-_id').exec((err, users) => {
      if (err) {
        res.status(500).send({ message: 'Error al devolver los usuarios' })
      } else {
        if (!users) {
          res.status(404).send({ message: 'No hay usuarios registrados.' })
        } else {
          res.status(200).send({ users })
        }
      }
    });
  } else if (config.defaultDB == "mssql") {
    // CONSULTA EN MSSQL
    let mssqlQuery = `SELECT * FROM users WHERE del = 0 ORDER BY usrName ASC;`

    new mssql.Request().query(mssqlQuery, (err, result) => {
      if (err) {
        res.status(500).send({ error: err.originalError.info.message, message: 'Error al devolver el usuario' })
        return
      }

      res.status(200).send(result.recordsets)
    })
    // MSSQL TERMINA
  }
}

function updateUser (req, res) {
  const userId = req.params.id
  const update = req.body

  // CONSULTA EN MSSQL
  let mssqlQuery = `
  UPDATE users SET
    idSuc = '${update.idSuc}',
    usrName = '${update.name}',
    lastname = '${update.lastname}',
    email = '${update.email}',
    usrPassword = '${update.password}',
    privilege = ${update.privilege}
  WHERE idUsr = ${userId} AND del = 0 ;`


  new mssql.Request().query(mssqlQuery, (err, result) => {
    if (err) {
      res.status(500).send({ error: err })
    }

    if (result.rowsAffected == true) {
      res.status(201).send('El usuario ha sido actualizado')
    } else {
      res.status(404).send({ message: 'No se encontro al usuario.' })
    }
  })
  // MSSQL TERMINA

}

function deleteUser (req, res) {
  const userId = req.params.id

  // CONSULTA EN MSSQL
  let mssqlQuery = `UPDATE users SET del = 1 WHERE idUsr = ${userId} AND del = 0;`

  new mssql.Request().query(mssqlQuery, (err, result) => {
    if (err) {
      res.status(500).send({ error: err })
    }

    if (result.rowsAffected == true) {
      res.status(201).send('El usuario ha sido borrado')
    } else {
      res.status(404).send({ message: 'No se encontro al usuario.' })
    }
  })
  // MSSQL TERMINA
}

module.exports = {
  existEmail,
  getUsrInfo,
  addUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser
}
