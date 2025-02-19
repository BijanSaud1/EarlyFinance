const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const verifyToken = (req, res, next) => {
  const token = req.cookies?.token; // ✅ Read token from cookies

  if (!token) {
    return res.status(401).json({ isAuthenticated: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Attach decoded user info
    next();
  } catch (err) {
    console.error("❌ Invalid Token:", err.message);
    res.status(401).json({ isAuthenticated: false, message: 'Invalid token' });
  }
};

module.exports = { verifyToken }; // ✅ Ensure it's correctly exported
