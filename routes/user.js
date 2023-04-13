const express = require('express')
const userController = require('../controllers/user')
const authenticate = require('../middlewares/authenticate')

const userRouter = express.Router()

userRouter
  .post('/api/authenticate', userController.authenticate)
  .get('/api/user', authenticate.verify, userController.getUser)

module.exports = userRouter