const express = require('express')
const postController = require('../controllers/post')
const authenticate = require('../middlewares/authenticate')

const postRouter = express.Router()

postRouter
  .post('/api/posts', authenticate.verify, postController.create)
  .delete('/api/posts/:id', authenticate.verify, postController.delete)
  .post('/api/like/:id', authenticate.verify, postController.like)
  .post('/api/unlike/:id', authenticate.verify, postController.unlike)
  .post('/api/comment/:id', authenticate.verify, postController.addComment)
  .get('/api/posts/:id', authenticate.verify, postController.getById)
  .get('/api/all_posts', authenticate.verify, postController.getAll)

module.exports = postRouter