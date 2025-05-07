// Node.js code using Firebase Admin SDK
import admin from "firebase-admin";

import serviceAccount from "./config/serviceAccountKey.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const setAdmin = async (uid) => {
  await admin.auth().setCustomUserClaims(uid, { isAdmin: true });
  console.log(`Set isAdmin=true for user: ${uid}`);
};

// Example usage
setAdmin("kf5KAS9LhEZmY3kbes10KvSlRUF3");
