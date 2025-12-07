// // src/config/firebase.ts

// import * as admin from 'firebase-admin';
// import path from 'path'; // Import Node.js path module for reliable path resolution

// // ⚠️ IMPORTANT: Set the path to your service account key file here. 
// // We use path.join and process.cwd() to create an ABSOLUTE path, 
// // ensuring the file is found regardless of the calling script's location.
// // process.cwd() refers to D:\eagle 3d assignment\eagle3d-backend
// const serviceAccountPath = path.join(process.cwd(), 'serviceAccountKey.json');

// // Function to check if the Firebase App is already initialized
// if (!admin.apps.length) {
//     try {
//         // Dynamically load the service account key JSON file
//         // Note: For require() to work with an absolute path, 
//         // the file must exist and be accessible by Node.js.
//         const serviceAccount = require(serviceAccountPath);

//         admin.initializeApp({
//             credential: admin.credential.cert(serviceAccount)
//         });
//         console.log("🔥 Firebase Admin SDK Initialized.");

//     } catch (error) {
//         console.error("❌ Firebase Admin SDK Initialization Error:", 
//                       "Ensure serviceAccountKey.json is in the correct path and valid.", 
//                       "Current Absolute Path attempted:", serviceAccountPath, // Log the absolute path
//                       "Error:", error);
//         // Exiting the process if initialization fails due to missing key
//         process.exit(1);
//     }
// }

// // Export the Auth and Firestore instances
// const auth = admin.auth();
// const db = admin.firestore();

// export { auth, db, admin };

import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
    } as admin.ServiceAccount),
  });

  console.log("🔥 Firebase Admin Initialized");
}

export default admin;
export const auth = admin.auth();
export const db = admin.firestore();
