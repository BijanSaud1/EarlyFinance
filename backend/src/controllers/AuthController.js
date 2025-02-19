const admin = require('../config/firebase');
const db = admin.firestore();
const UserModel = require('../models/UserModel');

const AuthController = {
  // ✅ SIGNUP
  async signup(req, res) {
    const { email, password, role, parentEmail } = req.body;

    try {
      // Create user in Firebase Auth
      const user = await admin.auth().createUser({ email, password });

      let parentId = null;

      // If user is a child, link them to a parent
      if (role.toLowerCase() === 'child') {
        const parentSnapshot = await db.collection('users').where('email', '==', parentEmail).get();
        if (parentSnapshot.empty) {
          return res.status(400).json({ message: "Parent not found. Enter a valid parent email." });
        }
        parentId = parentSnapshot.docs[0].id;
      }

      // Create user data object and store it in Firestore
      const userData = UserModel.createUserObject(user.uid, email, role, parentId);
      await db.collection('users').doc(user.uid).set(userData);

      // If the user is a child, update the parent's document with the child reference
      if (role.toLowerCase() === 'child') {
        await db.collection('users').doc(parentId).update({
          children: admin.firestore.FieldValue.arrayUnion(user.uid)
        });
      }

      // 🔹 Store session in Redis
      req.session.userId = user.uid;
      req.session.role = role;

      // ✅ Ensure the session is saved before sending response
      req.session.save((err) => {
        if (err) {
          console.error("❌ Error saving session:", err);
          return res.status(500).json({ message: "Session storage failed" });
        }
        console.log("✅ Session stored successfully:", req.session);
        res.status(201).json({ message: 'User created successfully', uid: user.uid, role });
      });
    } catch (error) {
      console.error("❌ Signup Error:", error.message);
      res.status(400).json({ message: error.message });
    }
  },

  // ✅ LOGIN
  async login(req, res) {
    const { email, password } = req.body;

    try {
      // Check if the user exists in Firebase Auth
      const user = await admin.auth().getUserByEmail(email);

      if (!password) {
        return res.status(401).json({ message: 'Invalid password' });
      }

      // Fetch the user role from Firestore
      const userDoc = await db.collection('users').doc(user.uid).get();
      if (!userDoc.exists) {
        return res.status(404).json({ message: 'User not found' });
      }

      const role = userDoc.data().role;  // Get the user's role from Firestore

      // 🔹 Store session in Redis
      req.session.userId = user.uid;
      req.session.role = role;

      // ✅ Ensure session is saved before responding
      req.session.save((err) => {
        if (err) {
          console.error("❌ Error saving session:", err);
          return res.status(500).json({ message: "Session storage failed" });
        }
        console.log("✅ Session stored successfully:", req.session);
        res.json({ message: 'Login successful', role });
      });
    } catch (error) {
      console.error("❌ Login Error:", error.message);
      res.status(401).json({ message: 'Invalid email or password' });
    }
  },

  // ✅ LOGOUT
  async logout(req, res) {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ message: "Logout failed" });
      console.log("✅ User logged out, session destroyed");
      res.status(200).json({ message: 'Logged out successfully' });
    });
  }
};

module.exports = AuthController;
