const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token = req.headers.authorization;

  console.log("Auth middleware - token present:", !!token);
  console.log("Auth header:", req.headers.authorization);

  if (!token || !token.startsWith("Bearer ")) {
    console.log("No token or invalid format");
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    token = token.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Token decoded successfully:", decoded);

    req.user = {
      id: decoded.id,
      _id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    console.log("req.user set:", req.user);
    next();
  } catch (error) {
    console.log("Token verification failed:", error.message);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }

  next();
};

module.exports = { protect, adminOnly };