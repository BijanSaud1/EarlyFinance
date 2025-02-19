const admin = require('../config/firebase');
const db = admin.firestore();

const UserController = {
  // ✅ GET USER PROFILE
  async getUserProfile(req, res) {
    const userId = req.session.userId; // Extract user ID from Redis session

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: No active session' });
    }

    try {
      const userDoc = await db.collection('users').doc(userId).get();
      if (!userDoc.exists) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(userDoc.data());
    } catch (error) {
      console.error("❌ Fetch User Profile Error:", error.message);
      res.status(400).json({ message: error.message });
    }
  }
};

module.exports = UserController;
