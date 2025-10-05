import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
  FacebookAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userSection, setUserSection] = useState(null);
  const [loading, setLoading] = useState(true);

  // Google Auth setup
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_EXPO_CLIENT_ID',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    webClientId: 'YOUR_WEB_CLIENT_ID',
  });

  // Facebook Auth setup
  const [fbRequest, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
    clientId: 'YOUR_FACEBOOK_APP_ID',
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user profile from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserRole(userData.role);
            setUserSection(userData.section);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUserRole(null);
        setUserSection(null);
      }
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Handle Google Auth Response
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      const credential = GoogleAuthProvider.credential(authentication.idToken, authentication.accessToken);
      signInWithCredential(auth, credential);
    }
  }, [response]);

  // Handle Facebook Auth Response
  useEffect(() => {
    if (fbResponse?.type === 'success') {
      const { authentication } = fbResponse;
      const credential = FacebookAuthProvider.credential(authentication.accessToken);
      signInWithCredential(auth, credential);
    }
  }, [fbResponse]);

  const signup = async (email, password, role, section) => {
    try {
      console.log('🔄 Starting signup process...', { email, role, section });
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('✅ Firebase Auth user created:', userCredential.user.uid);
      
      // Store user profile in Firestore
      const userData = {
        email: email,
        role: role,
        section: section,
        createdAt: new Date(),
      };
      
      console.log('💾 Saving to Firestore:', userData);
      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      console.log('✅ User data saved to Firestore successfully!');
      
      setUserRole(role);
      setUserSection(section);
      return userCredential.user;
    } catch (error) {
      console.error('❌ Signup error:', error);
      throw error;
    }
  };

  const login = async (email, password, selectedRole) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Fetch user profile to validate role
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Validate that the user is trying to login with their registered role
        if (userData.role !== selectedRole) {
          await signOut(auth); // Sign out the user
          throw new Error(`This account is registered as a ${userData.role}. Please select the correct role.`);
        }
        
        setUserRole(userData.role);
        setUserSection(userData.section);
      } else {
        await signOut(auth);
        throw new Error('User profile not found. Please contact support.');
      }
      
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserRole(null);
      setUserSection(null);
    } catch (error) {
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      await promptAsync();
    } catch (error) {
      throw error;
    }
  };

  const signInWithFacebook = async () => {
    try {
      await fbPromptAsync();
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    userRole,
    userSection,
    loading,
    signup,
    login,
    logout,
    signInWithGoogle,
    signInWithFacebook
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};