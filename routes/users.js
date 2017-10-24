'use strict'

const express = require('express')
const usersCtlr = require('../controllers/users')
const api = express.Router()

api.post('/user', usersCtlr.addUser)
api.get('/user/:id', usersCtlr.getUser)
api.get('/users', usersCtlr.getUsers)
api.put('/user/:id', usersCtlr.updateUser)
api.delete('/user/:id', usersCtlr.deleteUser)

module.exports = api
