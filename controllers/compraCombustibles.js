'use strict'

const config = require('../config')
const mssql = require('mssql')
const ComprasCombustible = require('../models/compraCombustibles')
const UsersFunctions = require('../controllers/api-log')

function compraCombustible (req, res) {
  const body = req.body

  const compra = new ComprasCombustible({
    idUsr: config.userTest,
    idSuc: body.idSuc,
    idTan: body.idTan,
    litros: body.litros,
    importe: body.importe,
    factura: body.factura,
    hraAumento: body.hraAumento
  })

  let queryCompraInsert = `
      INSERT INTO [dbo].[compraCombustible] ([idUsr], [idSuc], [idTan], [litros], [importe], [factura], [hraAumento], [dateReg])
        VALUES
      ('${compra.idUsr}','${compra.idSuc}','${compra.idTan}', '${compra.litros}', '${compra.importe}', '${compra.factura}', '${compra.hraAumento}', GETDATE());`

  let queryUpdateTanque = `UPDATE tanques SET litros = litros+${compra.litros}, ultimaRecarga = '${compra.hraAumento}' WHERE idTan = 8;`

console.log(queryCompraInsert)
console.log(queryUpdateTanque)


  // new mssql.Request().query(`${queryCompraInsert} ${queryUpdateTanque}`, (err, result) => {
  //   if (err) {
  //     res.status(500).send({ err, message: 'Error de consulta.' })
  //   }

  //   res.status(201).send({ result })

  //   // if (result.rowsAffected == true) {
  //   //   // res.status(201).send({ message: 'El usuario ha sido registrado' })
  //   // }
  // })
}

module.exports = {
  compraCombustible
}
