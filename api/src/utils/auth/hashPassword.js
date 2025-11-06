const bcrypt = require("bcryptjs");

const hashPassword = async (normalPassword, saltRounds) => {
  return bcrypt.hash(normalPassword, saltRounds);
};

module.exports = hashPassword;
