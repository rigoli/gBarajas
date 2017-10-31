'use strict'

const config = require('../config')
const mssql = require('mssql')

function insertLog (inf, msgLog) {
  let queryInsert = `
      INSERT INTO [dbo].[apiLog] ([idUsr], [idSuc], [msg], [dateReg])
        VALUES
      ('${inf.idUsr}','${inf.idSuc}', '${msgLog}', GETDATE());`

  new mssql.Request().query(queryInsert, (err, result) => {
    if (err) {
      res.status(500).send({ err, message: 'Error de consulta.', query: queryInsert })
    }

    if (result.rowsAffected == true) {
      res.status(201).send({ message: 'Registrado' })
    }
  })
}

module.exports = {
  insertLog
}
