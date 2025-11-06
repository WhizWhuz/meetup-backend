const generateToken = require("./generateToken");

function sendAuthResponse(res, user, message = "OK") {
  const token = generateToken({ id: user._id, role: user.role });
  return res.status(200).json({
    message,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}

module.exports = sendAuthResponse;
