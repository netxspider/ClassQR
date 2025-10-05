import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirebaseConfig, logConfigStatus } from './environment';

// Get Firebase configuration from environment variables
const firebaseConfig = getFirebaseConfig();

// Log configuration status in development
logConfigStatus();

console.log('🔥 Firebase initialized with environment variables');

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