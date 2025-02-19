const UserModel = require('../models/UserModel');
const admin = require('../config/firebase');
const db = admin.firestore();

// 🔹 Replaced Firebase token-based user extraction with Redis session
const ParentController = {
  // ✅ LINK CHILD TO PARENT
  async linkChild(req, res) {
    const parentId = req.session.userId;  // Extract parent ID from Redis session

    if (!parentId) {
      return res.status(401).json({ message: 'Unauthorized: No active session' });
    }

    try {
      const result = await UserModel.linkChildToParent(parentId, req.body.childId);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // ✅ GET PARENT'S CHILDREN
  async getChildren(req, res) {
    const parentId = req.session.userId;

    if (!parentId) {
      return res.status(401).json({ message: 'Unauthorized: No active session' });
    }

    try {
      const children = await UserModel.getParentChildren(parentId);
      res.json(children);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // ✅ GET CHILD DATA (Parent-Only)
  async getChildData(req, res) {
    const parentId = req.session.userId;
    const { childId } = req.params;

    if (!parentId) {
      return res.status(401).json({ message: 'Unauthorized: No active session' });
    }

    try {
      const childData = await UserModel.getChildData(parentId, childId);
      res.json(childData);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // ✅ GET PARENT INFO (Using Redis Session)
  async getParentInfo(req, res) {
    const parentId = req.session.userId;  // Extract from Redis session

    console.log('Parent ID (from session):', parentId);

    if (!parentId) {
      return res.status(401).json({ message: 'Unauthorized: No active session' });
    }

    try {
      const parentDoc = await db.collection('users').doc(parentId).get();

      if (!parentDoc.exists) {
        return res.status(404).json({ message: 'Parent not found' });
      }

      const parentData = parentDoc.data();
      const children = parentData.children || [];
      let childrenData = [];

      if (children.length > 0) {
        const childDocs = await Promise.all(
          children.map(childId => db.collection('users').doc(childId).get())
        );

        childrenData = childDocs.map(doc => (doc.exists ? doc.data() : null)).filter(Boolean);
      }

      res.json({ parent: parentData, children: childrenData });
    } catch (error) {
      console.error('❌ Error fetching parent info:', error.message);
      res.status(500).json({ message: 'Error fetching parent data', error: error.message });
    }
  },
};

module.exports = ParentController;
