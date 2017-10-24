'use strict'

const config = require('../config')
const mssql = require('mssql')
const Tanques = require('../models/tanques')

function regTanque (req, res) {
  const body = req.body

  const tanque = new Tanques({
    idSuc: body.idSuc,
    idCom: body.idCom
  })

  // GUARDANDO LA SUCURSAL
  let queryInsert = `
  INSERT INTO [dbo].[tanques] ([idSuc], [idCom])
    VALUES
  ('${tanque.idSuc}', ${tanque.idCom});`

  new mssql.Request().query(queryInsert, (err, result) => {
    if (err) {
      res.status(500).send({ err, message: 'Error de consulta.', query: queryInsert })
    }

    if (result.rowsAffected == true) {
      if (config.mongoEnable === true) {
        // UNA VEZ REGISTRADO EN SQL SERVER, EL USUARIO SE REGISTRA EN MONGDB PARA FUTURAS CONSULTAS
        // GUARDANDO EL USUARIO EN MONGODB
        tanque.save((err, tanqStored) => {
          if (err) return res.status(500).send({ error: `Hubo un error: ${err}. MONGODB.` })
          if (!tanqStored) return res.status(400).send({ error: 'No se pudo guardar el tanque. MONGODB.' })
        })
        // TERMINA MONGODB
      }
      res.status(201).send({ message: 'El tanque ha sido registrado.' })
    }
  })
  // TERMINA GUARDADO
}

function getTanque(req, res) {
  const tanqId = req.params.idTanq

  if (config.defaultDB == "mongodb") {
    Tanques.findById(sucId, (err, tanqId) => {
      if (err) {
        res.status(500).send({ message: 'Error al devolver tanque.' })
      } else {
        if (!tanqId) {
          res.status(404).send({ message: 'El tanque no existe.' })
        } else {
          res.status(200).send({ tanqId })
        }
      }
    })
  } else if (config.defaultDB == "mssql") {
    let mssqlQuery = `SELECT idSuc, idCom, ltros, ultimaRecarga FROM tanques WHERE idTan = ${tanqId} AND del = 0;`

    new mssql.Request().query(mssqlQuery, (err, result) => {
      if (err) {
        res.status(500).send({ error: err, message: 'Error al devolver tanque.' })
        return
      }

      if (result.rowsAffected == 0) {
        res.status(404).send({ message: 'No se encontro tanque.' })
        return
      }

      res.status(200).send(result.recordset)
    })
  }
}

function getTanques(req, res) {
  const idSuc = req.params.idSuc

  if (config.defaultDB == "mongodb") {
    Sucursales.find({}).sort('-_id').exec((err, sucursales) => {
      if (err) {
        res.status(500).send({ message: 'Error al devolver sucursales.' })
      } else {
        if (!sucursales) {
          res.status(404).send({ message: 'No hay sucursales registradas.' })
        } else {
          res.status(200).send({ sucursales })
        }
      }
    });
  } else if (config.defaultDB == "mssql") {
    // CONSULTA EN MSSQL
    let mssqlQuery = `SELECT idSuc, idCom, ltros, ultimaRecarga FROM tanques WHERE del = 0 `
    if (idSuc != null) {
      mssqlQuery += `AND idSuc = ${idSuc} `
    }
    mssqlQuery += `;`
    //mssqlQuery += `ORDER BY nombreSuc ASC;`

    new mssql.Request().query(mssqlQuery, (err, result) => {
      if (err) {
        res.status(500).send({ error: err.originalError.info.message, message: 'Error al devolver tanques.' })
        return
      }

      res.status(200).send(result.recordsets)
    })
    // MSSQL TERMINA
  }
}

function updateTanque (req, res) {
  const idTanq = req.params.idTanq
  const update = req.body

  // CONSULTA EN MSSQL
  let mssqlQuery = `
  UPDATE tanques SET
    idSuc = '${update.idSuc}',
    idCom = ${update.idCom}
  WHERE idTan = ${idTanq} AND del = 0 ;`

  new mssql.Request().query(mssqlQuery, (err, result) => {
    if (err) {
      res.status(500).send({ error: err })
    }

    if (result.rowsAffected == true) {
      res.status(201).send('El tanque ha sido actualizada.')
    } else {
      res.status(404).send({ message: 'No se encontro tanque.' })
    }
  })
  // MSSQL TERMINA
}

function deleteTanque (req, res) {
  var idTanq = req.params.idTanq

  // CONSULTA EN MSSQL
  let mssqlQuery = `UPDATE tanques SET del = 1 WHERE idTan = ${idTanq} AND del = 0;`

  new mssql.Request().query(mssqlQuery, (err, result) => {
    if (err) {
      res.status(500).send({ error: err })
    }

    if (result.rowsAffected == true) {
      res.status(201).send('El tanque ha sido borrado.')
    } else {
      res.status(404).send({ message: 'No se encontro tanque.' })
    }
  })
  // MSSQL TERMINA
}

module.exports = {
  regTanque,
  getTanque,
  getTanques,
  updateTanque,
  deleteTanque
}
