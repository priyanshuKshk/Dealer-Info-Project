const express = require("express");
const router = express.Router();
const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

// POST /auth/admin/signup
router.post("/admin/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await Admin.findOne({ email });
  if (existing) return res.status(409).json({ message: "Email already registered" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = new Admin({ name, email, password: hashedPassword });
  await admin.save();

 const token = jwt.sign(
  { id: admin._id, role: "admin" },
  process.env.JWT_SECRET,
  { expiresIn: "1d" } // ✅ 1 day session
);
res.json({ token });

});

// POST /auth/admin/login
router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(404).json({ message: "Admin not found" });

  const match = await bcrypt.compare(password, admin.password);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

 const token = jwt.sign(
  { id: admin._id, role: "admin" },
  process.env.JWT_SECRET,
  { expiresIn: "1d" } // ✅ 1 day session
);
res.json({ token });

});

module.exports = router;
