// backend/src/config/firebase.js
const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Resolve the absolute path to the Firebase config file
const serviceAccount = require(path.resolve(process.env.FIREBASE_ADMIN_SDK_PATH));

// Initialize Firebase with the service account
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
