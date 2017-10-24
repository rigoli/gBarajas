'use strict'

const express = require('express')
const tanquesCtlr = require('../controllers/tanques')
const api = express.Router()

api.post('/tanque', tanquesCtlr.regTanque)
api.get('/tanque/:idTanq', tanquesCtlr.getTanque)
api.get('/tanques/:idSuc?', tanquesCtlr.getTanques)
api.put('/tanque/:idTanq', tanquesCtlr.updateTanque)
api.delete('/tanque/:idTanq', tanquesCtlr.deleteTanque)

module.exports = api
