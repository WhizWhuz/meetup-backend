const jwt = require("jsonwebtoken");

module.exports = function generateToken(payload, expiresIn = "1h") {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};
