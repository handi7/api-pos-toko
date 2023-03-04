const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  createToken: (data, exp) => {
    return jwt.sign(data, process.env.JWT_KEY, { expiresIn: exp });
  },

  authToken: (req, res, next) => {
    try {
      const auth = jwt.verify(req.token, process.env.JWT_KEY);
      req.decoded = auth;
      next();
    } catch (error) {
      res.status(401).send(error);
    }
  },
};
