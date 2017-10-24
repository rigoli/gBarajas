'use strict'

const config = require('../config')
const mssql = require('mssql')
const Sucursales = require('../models/sucursales')

function addSucursal(req, res) {
  const body = req.body

  const sucursal = new Sucursales({
    nombreSuc: body.nombreSuc,
    encargado: body.idUsr
  })

  // GUARDANDO LA SUCURSAL
  let queryInsert = `
  INSERT INTO [dbo].[sucursales] ([nombreSuc], [encargado], [dateCreate])
    VALUES
  ('${sucursal.nombreSuc}', ${sucursal.encargado}, GETDATE());`

  new mssql.Request().query(queryInsert, (err, result) => {
    if (err) {
      res.status(500).send({ err, message: 'Error de consulta.', query: queryInsert })
    }

    if (result.rowsAffected == true) {
      if (config.mongoEnable === true) {
        // UNA VEZ REGISTRADO EN SQL SERVER, EL USUARIO SE REGISTRA EN MONGDB PARA FUTURAS CONSULTAS
        // GUARDANDO EL USUARIO EN MONGODB
        sucursal.save((err, sucStored) => {
          if (err) return res.status(500).send({ error: `Hubo un error: ${err}. MONGODB.` })
          if (!sucStored) return res.status(400).send({ error: 'No se guardó la sucursal. MONGODB.' })
        })
        // TERMINA MONGODB
      }
      res.status(201).send({ message: 'La sucursal ha sido registrada.' })
    }
  })
  // TERMINA GUARDADO
}

function getSucursal(req, res) {
  const sucId = req.params.id

  if (config.defaultDB == "mongodb") {
    Sucursales.findById(sucId, (err, sucId) => {
      if (err) {
        res.status(500).send({ message: 'Error al devolver la sucursal.' })
      } else {
        if (!sucId) {
          res.status(404).send({ message: 'La sucursal no existe.' })
        } else {
          res.status(200).send({ sucId })
        }
      }
    })
  } else if (config.defaultDB == "mssql") {
    let mssqlQuery = `SELECT nombreSuc, encargado, dateCreate FROM sucursales WHERE idSuc = ${sucId} AND del = 0;`

    new mssql.Request().query(mssqlQuery, (err, result) => {
      if (err) {
        res.status(500).send({ error: err.originalError.info.message, message: 'Error al devolver la sucursal.' })
        return
      }

      if (result.rowsAffected === 0) {
        res.status(404).send({ message: 'No se encontro la sucursal.' })
        return
      }

      res.status(200).send(result.recordset)
    })
  }
}

function getSucursales(req, res) {
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
    let mssqlQuery = `SELECT nombreSuc, encargado, dateCreate FROM sucursales WHERE del = 0 ORDER BY nombreSuc ASC;`

    new mssql.Request().query(mssqlQuery, (err, result) => {
      if (err) {
        res.status(500).send({ error: err.originalError.info.message, message: 'Error al devolver sucursales.' })
        return
      }

      res.status(200).send(result.recordsets)
    })
    // MSSQL TERMINA
  }
}

function updateSursal(req, res) {
  const sucId = req.params.id
  const update = req.body

  // CONSULTA EN MSSQL
  let mssqlQuery = `
  UPDATE sucursales SET
    nombreSuc = '${update.nombreSuc}',
    encargado = ${update.idUsr}
  WHERE idSuc = ${sucId} AND del = 0 ;`

  new mssql.Request().query(mssqlQuery, (err, result) => {
    if (err) {
      res.status(500).send({ error: err })
    }

    if (result.rowsAffected == true) {
      res.status(201).send('La sucursal ha sido actualizada.')
    } else {
      res.status(404).send({ message: 'No se encontro la sucursal.' })
    }
  })
  // MSSQL TERMINA
}

function deleteSucursal(req, res) {
  var sucId = req.params.id

  // CONSULTA EN MSSQL
  let mssqlQuery = `UPDATE sucursales SET del = 1 WHERE idSuc = ${sucId} AND del = 0;`

  new mssql.Request().query(mssqlQuery, (err, result) => {
    if (err) {
      res.status(500).send({ error: err })
    }

    if (result.rowsAffected == true) {
      res.status(201).send('La sucursal ha sido borrada.')
    } else {
      res.status(404).send({ message: 'No se encontro la sucursal.' })
    }
  })
  // MSSQL TERMINA
}

module.exports = {
  addSucursal,
  getSucursal,
  getSucursales,
  updateSursal,
  deleteSucursal
}
