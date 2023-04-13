const express = require('express')
const followController = require('../controllers/follow')
const authenticate = require('../middlewares/authenticate')

const followRouter = express.Router()

followRouter
    .post('/api/follow/:id', authenticate.verify, followController.follow)
    .post('/api/unfollow/:id', authenticate.verify, followController.unfollow)

module.exports = followRouter






