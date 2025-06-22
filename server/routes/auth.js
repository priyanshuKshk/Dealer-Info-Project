const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/users");
const router = express.Router();

// ✅ SIGNUP
router.post("/api/sign-up", async (req, res) => {
  try {
    const { firstName, lastName, phone, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      phone,
      email,
      password: hashedPassword,
      isAdmin: true // ✅ Make this user an admin if needed (optional, or use based on role logic)
    });

    const user = await newUser.save();
    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, "SECRET_KEY", {
      expiresIn: "3d",
    });

    res.status(200).json({
      message: "Signup successful",
      token,
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
      },
    });
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).json({ error: "Failed to sign up user" });
  }
});

// ✅ LOGIN
router.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, "SECRET_KEY", {
    expiresIn: "3d",
  });

  res.json({ token, user: { email: user.email, isAdmin: user.isAdmin } });
});

module.exports = router;
