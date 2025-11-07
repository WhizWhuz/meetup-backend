const bcrypt = require("bcryptjs");

const hashPassword = async (normalPassword, saltRounds = 12) => {
  return bcrypt.hash(normalPassword, saltRounds);
};

module.exports = hashPassword;
