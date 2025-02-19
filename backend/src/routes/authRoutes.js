const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

// ✅ SESSION CHECK ROUTE
router.get('/auth/session', (req, res) => {
  console.log("🔍 Checking Session:", req.session);

  if (!req.session) {
    console.log("🚨 No session found!");
    return res.status(401).json({ isAuthenticated: false });
  }

  if (!req.session.userId) {
    console.log("🚨 No user in session! Session exists but missing user data.");
    return res.status(401).json({ isAuthenticated: false });
  }

  console.log("✅ User session found:", req.session);
  res.json({ isAuthenticated: true, userId: req.session.userId, role: req.session.role });
});


router.post('/login', AuthController.login);
module.exports = router;
