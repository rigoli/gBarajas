'use strict'

const config = require('../config')
const mssql = require('mssql')
const ComprasCombustible = require('../models/compraCombustibles')
const UsersFunctions = require('../controllers/users')

function compraCombustible (req, res) {
  const body = req.body

  const compra = new ComprasCombustible({
    idUsr: config.userTest,
    idTan: body.idTan,
    litros: body.litros,
    importe: body.importe,
    factura: body.factura,
    hraAumento: body.hraAumento
  })

  UsersFunctions.getUsrInfo(compra.idUsr).then((usrInfo) => {
    let msgLog = `${usrInfo.usrName} ${usrInfo.lastname} Registro Compra de Combustible en Gasolinera  `
    console.log(msgLog)
    res.status(200).send(usrInfo.usrName)
  }).catch(function (err) {
    res.status(500).send({ error: err, message: 'Error en la promesa - "getUsrInfo".' })
  })

  // let queryCompraInsert = `
  //     INSERT INTO [dbo].[compraCombustible] ([idUsr], [idTan], [litros], [importes], [factura], [hraAumento], [dateReg])
  //       VALUES
  //     ('${compra.idUsr}','${compra.idTan}', '${compra.litros}', '${compra.importe}', '${compra.factura}', '${compra.hraAumento}');`

  // let queryUpdateTanque = `UPDATE tanques SET litros = '${compra.litros}', ultimaRecarga = '${compra.hraAumento}' WHERE idTan = 8;`

  // new mssql.Request().query(`${queryCompraInsert} ${queryUpdateTanque}`, (err, result) => {
  //   if (err) {
  //     res.status(500).send({ err, message: 'Error de consulta.', query: queryInsert })
  //   }

  //   if (result.rowsAffected == true) {

  //     if (config.mongoEnable === true) {
  //       // UNA VEZ REGISTRADO EN SQL SERVER, EL USUARIO SE REGISTRA EN MONGDB PARA FUTURAS CONSULTAS
  //       // GUARDANDO EL USUARIO EN MONGODB
  //       user.save((err, compraStored) => {
  //         if (err) return res.status(500).send({ error: `Hubo un error: ${err}. MONGODB` })
  //         if (!compraStored) return res.status(400).send({ error: 'No se guardó el usuario. MONGODB' })
  //       })
  //       // TERMINA MONGODB
  //     }
  //     res.status(201).send({ message: 'El usuario ha sido registrado' })
  //   }
  // })
}

module.exports = {
  compraCombustible
}
