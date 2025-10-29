const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register a new user 
//Log the attempt, validate input, check for existing user, hash password, create user, generate JWT, respond.

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!email || !password || typeof password !== 'string') {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    console.log(`Register attempt: ${email}`);

    const existing = await User.findOne({ email });
    if (existing) {
      console.log(`Register failed: user exists ${email}`);
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name || null,
      email,
      password: hashed,
    });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log(`Register success: ${email}`);

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Registration failed', details: err.message });
  }
};
