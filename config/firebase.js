import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAYTBHuWmrEeDTdBQDFLLyUJtqk1L6OPbI",
  authDomain: "classqr-d744c.firebaseapp.com",
  databaseURL: "https://classqr-d744c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "classqr-d744c",
  storageBucket: "classqr-d744c.firebasestorage.app",
  messagingSenderId: "87963962135",
  appId: "1:87963962135:web:1c1102d70587ce31470552",
  measurementId: "G-3PYSZLF4EW"
};

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  if (error.code === 'app/duplicate-app') {
    // App already initialized, get the existing app
    const { getApp } = require('firebase/app');
    app = getApp();
  } else {
    throw error;
  }
}

// Initialize Auth with AsyncStorage persistence
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (error) {
  if (error.code === 'auth/already-initialized') {
    auth = getAuth(app);
  } else {
    throw error;
  }
}

// Initialize Firestore
const db = getFirestore(app);

// Initialize Realtime Database
const rtdb = getDatabase(app);

export { auth, db, rtdb };
export default app;