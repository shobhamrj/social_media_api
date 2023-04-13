const db = require('../dbConfig')

const followController = {
    follow: async (req, res) => {
        try {
            const userId = req.body.user.id
            const followerUserId = req.params.id
            await db.none('INSERT INTO follows (user_id, follower_id) VALUES ($1, $2)', [userId, followerUserId])
            return res.json({ message: 'Successfully followed user' })
        } catch (error) {
            console.error(error)
            if(error.code === '23503') {
                return res.status(400).json({ error: error})
            }
            return res.status(500).json({ error: 'Internal server error' })
        }
    },
    
    unfollow: async (req, res) => {
        try {
            const userId = req.body.user.id
            const followedUserId = req.params.id
            const qRes = await db.oneOrNone('DELETE FROM follows WHERE user_id = $1 AND follower_id = $2 RETURNING follower_id', [userId, followedUserId])
            if(!qRes) {
                return res.status(400).json({ error: 'User you are trying to follow does not exists !' })
            }
            return res.json({ message: 'Successfully unfollowed user' })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: 'Internal server error' })
        }
    }
}

module.exports = followController