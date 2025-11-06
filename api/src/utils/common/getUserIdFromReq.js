module.exports = function getUserIdFromReq(req) {
  return req.user?.id || req.user?.userId || null;
};
