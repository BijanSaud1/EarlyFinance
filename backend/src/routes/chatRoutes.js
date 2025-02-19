const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/chatController');

// Middleware to check if the user is authenticated via Redis session
const authenticateSession = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Unauthorized: No active session' });
    }
    next();
};

// POST route for sending messages to the chatbot (only for authenticated users)
router.post('/chat', authenticateSession, ChatController.handleChat);

module.exports = router;
