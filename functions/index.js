const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// 🔐 Helper: Check if caller is admin
async function isAdmin(context) {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User not logged in");
  }

  const userDoc = await admin.firestore()
    .collection("users")
    .doc(context.auth.uid)
    .get();

  if (!userDoc.exists || userDoc.data().role !== "admin") {
    throw new functions.https.HttpsError("permission-denied", "Only admins can perform this action");
  }

  return true;
}

// ✅ Update user email
exports.updateUserEmail = functions.https.onCall(async (data, context) => {
  await isAdmin(context);

  const { uid, newEmail } = data;

  try {
    // Update email in Firebase Auth
    await admin.auth().updateUser(uid, { email: newEmail });

    // Update email in Firestore
    await admin.firestore().collection("users").doc(uid).update({ email: newEmail });

    return { success: true, message: `Successfully updated email for user ${uid}` };
  } catch (error) {
    console.error("Error updating user email:", error);
    throw new functions.https.HttpsError("internal", "Failed to update user email");
  }
});

// ✅ Delete user
exports.deleteUser = functions.https.onCall(async (data, context) => {
  await isAdmin(context);

  const { uid } = data;

  try {
    // Delete from Firebase Auth
    await admin.auth().deleteUser(uid);

    // Delete from Firestore
    await admin.firestore().collection("users").doc(uid).delete();

    return { success: true, message: `Successfully deleted user ${uid}` };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new functions.https.HttpsError("internal", "Failed to delete user");
  }
});
