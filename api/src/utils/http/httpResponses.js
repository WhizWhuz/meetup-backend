function badRequest(res, error) {
  return res.status(400).json({ error });
}
function unauthorized(res, error = "Unauthorized") {
  return res.status(401).json({ error });
}
function notFound(res, error = "Not found") {
  return res.status(404).json({ error });
}

module.exports = { badRequest, unauthorized, notFound };
