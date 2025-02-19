const express = require('express');
const router = express.Router();
const ParentController = require('../controllers/ParentController');

// Middleware to check if the user is authenticated via Redis session
const authenticateSession = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Unauthorized: No active session' });
    }
    next();
};

// Apply authentication middleware to all routes
router.use(authenticateSession);

// Parent-specific routes
router.post('/link-child', ParentController.linkChild);
router.get('/:parentId/children', ParentController.getChildren);
router.get('/:parentId/child/:childId', ParentController.getChildData);
router.get('/parent-info', ParentController.getParentInfo); // Ensure this route is included

module.exports = router;
