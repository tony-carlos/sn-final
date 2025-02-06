

// scripts/setAdminRole.js
const admin = require("firebase-admin");
const serviceAccount = require("../keys/serviceAccountKey.json"); // Path to service account key

// Initialize Firebase Admin with explicit credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function setAdminRole(uid) {
  try {
    await admin.auth().setCustomUserClaims(uid, { role: "admin" });
    console.log(`Admin claim set for user ${uid}`);
  } catch (error) {
    console.error("Error setting admin role:", error);
  }
}

// Replace with the actual user UID
const userId = "IvvW0i2VXMepa7qs68WVsNIZ8U73";
setAdminRole(userId);
