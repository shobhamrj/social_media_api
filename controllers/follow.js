const db = require('../dbConfig');

const followController = {
    follow: async (req, res) => {
        try {
            const userId = req.body.user.id; // Authenticated user ID
            const followedUserId = req.params.id; // User ID to be followed
            await db.none('INSERT INTO follows (user_id, follower_id) VALUES ($1, $2)', [userId, followedUserId]);
            return res.json({ message: 'Successfully followed user' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
    
    unfollow: async (req, res) => {
        try {
            const userId = req.body.user.id;
            const followedUserId = req.params.id;
            await db.none('DELETE FROM follows WHERE user_id = $1 AND follower_id = $2', [userId, followedUserId]);
            return res.json({ message: 'Successfully unfollowed user' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = followController