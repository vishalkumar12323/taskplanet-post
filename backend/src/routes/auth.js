import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { signToken, authRequired } from "../middleware/auth.js";

const router = express.Router();

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, passwordHash });
    const token = signToken(user);

    return res.status(201).json({
      token,
      user: user.toPublicProfile(),
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Failed to sign up." });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = signToken(user);

    return res.json({
      token,
      user: user.toPublicProfile(),
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Failed to log in." });
  }
});

// GET /api/auth/me
router.get("/me", authRequired, async (req, res) => {
  return res.json({
    user: req.user.toPublicProfile(),
  });
});

export default router;

