// Firebase configuration EXAMPLE
// Copy this file to firebase.js and replace with your actual Firebase config

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration - REPLACE THESE VALUES
// Get your config from: https://console.firebase.google.com/
// Project Settings → Your apps → Web app
const firebaseConfig = {
  apiKey: "AIzaSy...",                    // Your API Key
  authDomain: "your-app.firebaseapp.com", // Your Auth Domain
  projectId: "your-project-id",            // Your Project ID
  storageBucket: "your-app.appspot.com",  // Your Storage Bucket
  messagingSenderId: "123456789012",       // Your Messaging Sender ID
  appId: "1:123:web:abc123"                // Your App ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore Database
export const db = getFirestore(app);

// Initialize Authentication
export const auth = getAuth(app);

export default app;
