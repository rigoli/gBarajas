'use strict'

const express = require('express')
const compraCombustibleCtlr = require('../controllers/compraCombustibles')
const api = express.Router()

api.post('/compraCombustible', compraCombustibleCtlr.compraCombustible)
// api.get('/compraCombustible', compraCombustibleCtlr.getCompraCombustible)
// api.get('/comprasCombustibles/:idSuc?', compraCombustibleCtlr.getComprasCombustibles)
// api.put('/compraCombustible/:id', compraCombustibleCtlr.updateCompraCombustible)
// api.delete('/compraCombustible/:id', compraCombustibleCtlr.deleteCompraCombustible)

module.exports = api
