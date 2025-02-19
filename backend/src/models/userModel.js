const UserModel = {
  createUserObject(uid, email, role, parentId = null) {
    const normalizedRole = role.toLowerCase(); // Ensure role consistency

    const userData = {
      uid,
      email,
      role: normalizedRole,
      parentId: parentId || null, // Ensures parentId is either a valid value or null
      createdAt: new Date().toISOString()
    };

    // ✅ Add `children` array only for parents
    if (normalizedRole === 'parent') {
      userData.children = [];
    }

    return userData;
  }
};

module.exports = UserModel;
