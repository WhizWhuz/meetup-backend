const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Registera användare
exports.register = async (req, res) => {
  const { email, password, name } = req.body;

  if (!password || typeof password !== "string") {
    return res
      .status(400)
      .json({ message: "Lösenordet fattas eller är felaktigt" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Användaren finns redan!" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(201).json({
      message: "Registrering lyckades!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Registrerings error:", err);
    res.status(500).json({
      message: "Registrering misslyckades ",
      error: err.message || "Okänd error",
    });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(401)
        .json({ message: "Felaktigt användarnamn eller lösenord!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Felaktigt användarnamn eller lösenord!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Inloggning lyckades!",
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Inloggning misslyckades!", error: err.message });
  }
};

// Hämta en användare
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name email");
    if (!user) return res.status(404).json({ message: "Användare ej funnen" });

    res.status(200).json({ user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gick ej att hämmta annvändare", error: err.message });
  }
};
