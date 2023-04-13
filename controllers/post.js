const db = require('../dbConfig')

const postController = {
    create: async (req, res) => {
        try {
            const userId = req.body.user.id
            const { title, description } = req.body.user
            if(!title || !description) {
                return res.status(500).json({ error: 'Comment tile and description is required feild' })
            }
            const post = await db.one('INSERT INTO posts (title, description, user_id) VALUES ($1, $2, $3) RETURNING id, title, description, created_at', [title, description, userId])
            return res.json({ post })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: 'Internal server error' })
        }
    },
    delete: async (req, res) => {
        try {
            const userId = req.body.user.id
            const postId = req.params.id
            const post = await db.one('SELECT user_id FROM posts WHERE id = $1', postId)
            if (post.user_id !== userId) {
                return res.status(403).json({ error: 'You do not have permission to delete this post' })
            }
            await db.none('DELETE FROM posts WHERE id = $1', postId)
            return res.json({ message: 'Successfully deleted post' })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: 'Internal server error' })
        }
    },
    like: async (req, res) => {
        try {
            const userId = req.body.user.id
            const postId = req.params.id
            await db.none('INSERT INTO likes (user_id, post_id) VALUES ($1, $2)', [userId, postId])
            return res.json({ message: 'Successfully liked post' })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: 'Internal server error' })
        }
    },
    unlike: async (req, res) => {
        try {
            const userId = req.body.user.id
            const postId = req.params.id
            await db.none('DELETE FROM likes WHERE user_id = $1 AND post_id = $2', [userId, postId])
            return res.json({ message: 'Successfully unliked post' })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: 'Internal server error' })
        }
    },
    addComment: async (req, res) => {
        try {
            const postId = req.params.id
            const userId = req.body.user.id
            const { comment } = req.body.user
            if(!comment) {
                return res.status(400).json({ error: 'Comment cant be blank !' })
            }
            const c = await db.one('INSERT INTO comments (comment, user_id, post_id) VALUES ($1, $2, $3) RETURNING id', [comment, userId, postId])
            return res.json({ commentId: c.id })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: 'Internal server error' })
        }
    },
    getById: async (req, res) => {
        try {
            const postId = req.params.id
            const post = await db.oneOrNone('SELECT p.id, p.title, p.description, p.created_at, COUNT(l.id) AS likes_count, json_agg(json_build_object(\'id\', c.id, \'comment\', c.comment, \'user_id\', c.user_id)) AS comments FROM posts p LEFT JOIN likes l ON p.id = l.post_id LEFT JOIN comments c ON p.id = c.post_id WHERE p.id = $1 GROUP BY p.id', postId)
            if(!post) {
                return res.status(404).json({ error: 'Post not found !' })
            }
            return res.json(post)
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: 'Internal server error' })
        }
    },
    getAll: async (req, res) => {
        try {
            const userId = req.body.user.id
            const posts = await db.any('SELECT p.id, p.title, p.description, p.created_at, COUNT(l.id) AS likes_count, json_agg(json_build_object(\'id\', c.id, \'comment\', c.comment, \'user_id\', c.user_id)) AS comments FROM posts p LEFT JOIN likes l ON p.id = l.post_id LEFT JOIN comments c ON p.id = c.post_id WHERE p.user_id = $1 GROUP BY p.id ORDER BY p.created_at DESC', userId)
            return res.json(posts)
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: 'Internal server error' })
        }
    }
}

module.exports = postController
