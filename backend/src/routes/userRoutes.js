const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

// Middleware to check if the user is authenticated via Redis session
const authenticateSession = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Unauthorized: No active session' });
    }
    next();
};

// ✅ GET USER PROFILE (Protected by Redis session authentication)
router.get('/profile', authenticateSession, UserController.getUserProfile);

module.exports = router;
