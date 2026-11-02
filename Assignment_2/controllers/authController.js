const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (userId) => jwt.sign(
  { userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
);

// POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "Name, email and password are required." });
    if (password.length < 6)
      return res.status(400).json({ success: false, message: "Password must contain at least 6 characters." });

    const normalizedEmail = email.trim().toLowerCase();
    if (await User.findOne({ email: normalizedEmail }))
      return res.status(409).json({ success: false, message: "An account with this email already exists." });

    // Password ko plain text me store nahi karna; bcrypt hash banana
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name: name.trim(), email: normalizedEmail, password: hashedPassword });
    const token = generateToken(user._id);
    return res.status(201).json({ success: true, message: "User registered successfully.", token,
      user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ success: false, message: "Email already registered." });
    if (error.name === "ValidationError") return res.status(400).json({ success: false, message: error.message });
    console.error("Register error:", error);
    return res.status(500).json({ success: false, message: "Server error while registering user." });
  }
};

// POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password are required." });
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    const token = generateToken(user._id);
    return res.status(200).json({ success: true, message: "Login successful.", token,
      user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Server error while logging in." });
  }
};

// GET /api/auth/me (protected)
const getCurrentUser = async (req, res) => res.status(200).json({ success: true,
  user: { id: req.user._id, name: req.user.name, email: req.user.email, createdAt: req.user.createdAt } });

module.exports = { registerUser, loginUser, getCurrentUser };
