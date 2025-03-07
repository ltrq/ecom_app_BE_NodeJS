//src/utils/firebase.ts
// src/utils/firebase.ts
import * as admin from 'firebase-admin';

const serviceAccount = require('../../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
});

export const auth = admin.auth();
export const db = admin.firestore();
export const adminApp = admin; // Export for potential future use

// // Temporary test token generation
// auth
//   .createCustomToken('test-user-123')
//   .then((customToken) => {
//     console.log('Test Custom Token:', customToken);
//   })
//   .catch((error) => console.error('Error creating token:', error));
