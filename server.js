const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pgp = require('pg-promise')();
const cn = {
    host: 'localhost',
    port: 5432,
    database: 'social_media',
    user: 'shobham',
    password: '',
    allowExitOnIdle: true
};
const db = pgp(cn);
const {authenticate} = require('./middlewares/authenticate');


const app = express();
app.use(express.json());

const secretKey = 'your-secret-key';

app.post('/api/authenticate', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await db.oneOrNone('SELECT * FROM users WHERE email = $1', email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
        return res.json({ token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/api/follow/:id', authenticate, async (req, res) => {
    try {
        const userId = req.body.user.id; // Authenticated user ID
        const followedUserId = req.params.id; // User ID to be followed
        await db.none('INSERT INTO follows (user_id, follower_id) VALUES ($1, $2)', [userId, followedUserId]);
        return res.json({ message: 'Successfully followed user' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/api/unfollow/:id', authenticate, async (req, res) => {
    try {
        const userId = req.body.user.id;
        const followedUserId = req.params.id;
        await db.none('DELETE FROM follows WHERE user_id = $1 AND follower_id = $2', [userId, followedUserId]);
        return res.json({ message: 'Successfully unfollowed user' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/user', authenticate, async (req, res) => {
    try {
        const userId = req.body.user.id;
        const user = await db.one('SELECT name, followers, following FROM users WHERE id = $1', userId);
        return res.json({ user });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/posts', authenticate, async (req, res) => {
    try {
        const userId = req.body.user.id;
        const { title, description } = req.body.user; 
        const post = await db.one('INSERT INTO posts (title, description, user_id) VALUES ($1, $2, $3) RETURNING id, title, description, created_at', [title, description, userId]);
        return res.json({ post });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});



app.delete('/api/posts/:id', authenticate, async (req, res) => {
    try {
        const userId = req.body.user.id;
        const postId = req.params.id; 
        const post = await db.one('SELECT user_id FROM posts WHERE id = $1', postId);
        if (post.user_id != userId) {
            return res.status(403).json({ error: 'You do not have permission to delete this post' });
        }
        await db.none('DELETE FROM posts WHERE id = $1', postId);
        return res.json({ message: 'Successfully deleted post' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/api/like/:id', authenticate, async (req, res) => {
    try {
        const userId = req.body.user.id;
        const postId = req.params.id;
        await db.none('INSERT INTO likes (user_id, post_id) VALUES ($1, $2)', [userId, postId]);
        return res.json({ message: 'Successfully liked post' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/api/unlike/:id', authenticate, async (req, res) => {
    try {
        const userId = req.body.user.id;
        const postId = req.params.id;
        await db.none('DELETE FROM likes WHERE user_id = $1 AND post_id = $2', [userId, postId]);
        return res.json({ message: 'Successfully unliked post' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/comment/:id', authenticate, async (req, res) => {
    try {
        const userId = req.body.user.id;
        const postId = req.params.id;
        const { comment } = req.body.user;
        const c = await db.one('INSERT INTO comments (comment, user_id, post_id) VALUES ($1, $2, $3) RETURNING id', [comment, userId, postId]);
        return res.json({ commentId: c.id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/posts/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await db.one('SELECT p.id, p.title, p.desc, p.created_at, COUNT(l.id) AS likes_count, json_agg(json_build_object(\'id\', c.id, \'comment\', c.comment, \'user_id\', c.user_id)) AS comments FROM posts p LEFT JOIN likes l ON p.id = l.post_id LEFT JOIN comments c ON p.id = c.post_id WHERE p.id = $1 GROUP BY p.id', postId);
        return res.json(post);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/api/all_posts', authenticate, async (req, res) => {
    try {
        const userId = req.body.user.id;
        const posts = await db.any('SELECT p.id, p.title, p.desc, p.created_at, COUNT(l.id) AS likes_count, json_agg(json_build_object(\'id\', c.id, \'comment\', c.comment, \'user_id\', c.user_id)) AS comments FROM posts p LEFT JOIN likes l ON p.id = l.post_id LEFT JOIN comments c ON p.id = c.post_id WHERE p.user_id = $1 GROUP BY p.id ORDER BY p.created_at DESC', userId);
        return res.json(posts);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen('3000', () => {
    console.log('Listening on port 3000');
});