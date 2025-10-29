const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");



//TODO: två funktioner som är viktiga login och logout 
//TODO: läsa in email och password från req.body
//FIXME: OM INGEN ANVÄNDARE HITTAS ? SVAR MED 400 
//TODO: log out gör att user log ou och ger 200
//TODO: SÄKERHET MED JWT



exports.login = async (req, res) => {
  try {
  const { email, password } = req.body;

  // simple attempt log (no passwords)
  console.log(`Login attempt: ${email || "(missing)"}`);

  const user = await User.findOne({ email }).select("+password");

    if (!user) {
      console.log(`......Login failed: user not found for email=${email || "(missing)"}`);
      return res.status(400).json({ error: "Incorrect email or password." });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      console.log(`...Login failed: invalid password for email=${email || "(missing)"}`);
      return res.status(400).json({ error: "Incorrect email or password." });
    }


    //TODO jwt
    const token = jwt.sign(
      { userId: user._id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "6h" }
    );

    // simple console log
    console.log(`Login success: ${user.email}`);

    res.status(200).json({ message: "Successful login.", token, name: user.name });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Error logging in." });
  }
};

//FIXME: OM INGEN ANVÄNDARE HITTAS ? SVAR MED 400
// Simple logout handler
exports.logout = (req, res) => {
  console.log(".......User logged out");
  return res.status(200).json({ message: "Logged out" });
};
