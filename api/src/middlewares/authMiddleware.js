const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return res
      .status(401)
      .json({ message: "Åtkomst nekad. Finns ingen token" });
  }

  const secret = process.env.JWT_SECRET || process.env.JWT_SECRET_KEY;
  if (!secret)
    return res.status(500).json({ message: "Servern saknar JWT-secret" });

  try {
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id).select("_id name role").lean();
    if (!user)
      return res.status(401).json({ message: "Användaren hittades ej." });

    req.user = {
      id: String(user._id),
      userId: String(user._id),
      name: user.name || "Anonymous",
      role: user.role || "user",
    };

    next();
  } catch {
    return res.status(401).json({ message: "Felaktig eller ogiltlig token" });
  }
};
