module.exports = function validateRequired(fields, body) {
  const missing = fields.filter((f) => !body[f]);
  return missing;
};
