const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "midhun12345";

const authMiddleware = (req, res, next) => {
  try {
    // Check for token in different places
    const token = 
      req.headers.authorization?.split(' ')[1] || // Bearer Token
      req.cookies?.token ||                       // Cookie
      req.headers['x-access-token'];             // Custom header

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Access denied. No token provided." 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Add user info to request
    req.user = {
      _id: decoded._id,
      role: decoded.role,
      email: decoded.email
    };

    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.status(403).json({
      success: false,
      message: error.message === 'jwt expired' 
        ? 'Token has expired' 
        : 'Invalid token'
    });
  }
};

module.exports = authMiddleware;