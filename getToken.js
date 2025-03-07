const { initializeApp } = require('firebase/app');
const { getAuth, signInWithCustomToken } = require('firebase/auth');
const axios = require('axios');

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID, // Optional, remove if not used
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function getCustomToken() {
  try {
    const response = await axios.get(
      'http://localhost:3000/api/auth/generate-token'
    );
    return response.data.token;
  } catch (error) {
    console.error('Error fetching custom token:', error);
    throw error;
  }
}

getCustomToken()
  .then((customToken) => {
    console.log('Fetched custom token:', customToken);
    return signInWithCustomToken(auth, customToken);
  })
  .then((userCredential) => {
    return userCredential.user.getIdToken();
  })
  .then((idToken) => {
    console.log('ID Token:', idToken);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
