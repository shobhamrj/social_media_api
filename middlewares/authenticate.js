const jwt = require("jsonwebtoken");

const SECRET_KEY = 'secret-key';

const authenticate = {
  verify: (req, res, next) => {
    const auth = req.headers["authorization"];
    if (!auth || auth.length === 0) {
      return res.sendStatus(401);
    }
    const splits = auth.split(" ");
    if (splits[0] !== "Bearer" || splits[1].length === 0) {
      return res.sendStatus(401);
    }
    try {
      const token = jwt.verify(splits[1], SECRET_KEY);
    } catch (e) {
      return res.sendStatus(401);
    }
    next();
  },
};

module.exports = authenticate;
