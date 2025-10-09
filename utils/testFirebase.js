import { ref, set, get } from 'firebase/database';
import { rtdb, auth } from '../config/firebase';

export const testFirebaseRTDB = async () => {
  try {
    console.log('🧪 Testing Firebase Realtime Database connection...');
    
    // Check auth
    const user = auth.currentUser;
    console.log('👤 Auth user:', user ? { uid: user.uid, email: user.email } : 'Not authenticated');
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Test write
    const testRef = ref(rtdb, `test/${user.uid}`);
    const testData = {
      timestamp: Date.now(),
      message: 'Hello from ClassQR',
      user: user.uid
    };
    
    console.log('📝 Writing test data...');
    await set(testRef, testData);
    console.log('✅ Write successful');
    
    // Test read
    console.log('📖 Reading test data...');
    const snapshot = await get(testRef);
    if (snapshot.exists()) {
      console.log('✅ Read successful:', snapshot.val());
      return true;
    } else {
      console.log('⚠️ No data found');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Firebase RTDB test failed:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message
    });
    return false;
  }
};