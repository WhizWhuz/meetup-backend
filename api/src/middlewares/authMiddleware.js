const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Åtkomst nekad. Finns ingen token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Användaren hittades ej." });
    }

    req.user = { id: user._id };
    next();
  } catch (err) {
    return res.status(403).json({ message: "Felaktig eller ogiltlig token" });
  }
};
