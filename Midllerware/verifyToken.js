const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET; // Store this in env for production

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Splits "Bearer <token>" and gets just the token

  if (!token) {
    return res.status(403).json({
      status: "fail",
      message: "Access denied, no token provided",
    });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid token",
      });
    }
    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
