const userProgress = {
  topic: 'Investment',
  score: 8,
  date: new Date().toISOString(),
  completed: true
};

// Ensure user is authenticated before storing progress
if (!req.session.userId) {
  return res.status(401).json({ message: 'Unauthorized: No active session' });
}

// Store learning progress under the child's document, appending to existing progress
await db.collection('userProgress').doc(childUid).update({
  progress: admin.firestore.FieldValue.arrayUnion(userProgress)
});
