const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Utils & Validators

const asyncHandler = require("../utils/http/asyncHandler");
const hashPassword = require("../utils/auth/hashPassword");
const sendAuthResponse = require("../utils/auth/sendAuthResponse");
const requireAuth = require("../utils/http/requireAuth");

const { registerSchema, loginSchema } = require("../validators/authSchemas");

// Zod Helper → err 400

const sendZodError = (res, error) => {
  return res.status(400).json({
    message: "Ogiltiga fält",
    errors: error.flatten().fieldErrors,
  });
};

exports.register = asyncHandler(async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendZodError(res, parsed.error);
  }

  const { email, password, name } = parsed.data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Användaren finns redan!" });
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return sendAuthResponse(res, user, "Registrering lyckades!");
});

exports.login = asyncHandler(async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendZodError(res, parsed.error);
  }

  const { email, password } = parsed.data;

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

  return sendAuthResponse(res, user, "Inloggning lyckades!");
});

exports.getProfile = asyncHandler(async (req, res) => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const user = await User.findById(userId).select("name email createdAt");
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(200).json(user);
});
