const getUserIdFromReq = require("../common/getUserIdFromReq");

function requireAuth(req, res) {
  const userId = getUserIdFromReq(req);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }
  return userId;
}

module.exports = requireAuth;
