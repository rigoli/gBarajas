'use strict'

const express = require('express')
const sucCtlr = require('../controllers/sucursales')
const api = express.Router()

api.post('/suc', sucCtlr.addSucursal)
api.get('/suc/:id', sucCtlr.getSucursal)
api.get('/sucs', sucCtlr.getSucursales)
api.put('/suc/:id', sucCtlr.updateSursal)
api.delete('/suc/:id', sucCtlr.deleteSucursal)

module.exports = api
