// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/users"); // Adjust path as needed

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Please login or signup" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(401).json({ message: "Invalid token, user not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token verification failed" });
  }
};
const isAdmin = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user || !user.isAdmin) {
    return res.status(403).json({ error: "Access denied: Admins only" });
  }
  next();
};


module.exports = {authMiddleware, isAdmin};
