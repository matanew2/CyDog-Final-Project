// middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.authenticate = async (req, res, next) => {
  try {
    // Get token from session or Authorization header
    let token = null;

    // First check if token exists in session
    if (req.session && req.session.token) {
      token = req.session.token;
    }
    // Fall back to Authorization header
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

    // Find user by id
    const user = await User.findByPk(decoded.sub);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Add user to request object
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
      permissions: user.permissions,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      // Clear invalid session
      if (req.session) {
        req.session.destroy();
      }
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    res.status(500).json({ error: "Authentication failed" });
  }
};
