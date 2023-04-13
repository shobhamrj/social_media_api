const jwt = require("jsonwebtoken")
const SECRET_KEY = 'secret-key'

const authenticate = {
  verify: (req, res, next) => {
    const auth = req.headers["authorization"]
    if (!auth || auth.length === 0) {
      return res.status(401).json({ error: 'Unauthorized Access' })
    }
    const splits = auth.split(" ")
    if (splits[0] !== "Bearer" || splits[1].length === 0) {
      return res.status(401).json({ error: 'Unauthorized Access' })
    }
    try {
      const token = jwt.verify(splits[1], SECRET_KEY)
    } catch (e) {
      return res.status(401).json({ error: 'Unauthorized Access' })
    }
    next()
  }
}

module.exports = authenticate
