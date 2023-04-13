const jwt = require('jsonwebtoken')
const secretKey = 'secret-key'
const db = require('../dbConfig')
const {use} = require("chai")

const userController = {
    authenticate: async (req, res) => {
        try {
            const { email, password } = req.body
            const user = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email])
            if (!user || user.password !== password) {
                return res.status(401).json({ error: 'Invalid email or password' })
            }
            const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '12h' })
            return res.json({ token })
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' })
        }
    },

    getUser: async (req, res) => {
        try {
            const userId = req.body.user.id
            const user = await db.one('SELECT name, followers, following FROM users WHERE id = $1', userId)
            return res.json({ user })
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' })
        }
    }
}

module.exports = userController