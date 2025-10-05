import { ref, set, push, onValue, off, serverTimestamp, remove } from 'firebase/database';
import { collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';
import { rtdb, db, auth } from '../config/firebase';
import * as Location from 'expo-location';

class QRService {
  // Generate a unique QR session
  async generateQRSession(section, teacherId) {
    try {
      console.log('🔄 Starting QR session generation...', { section, teacherId });
      
      // Check authentication
      const currentUser = auth.currentUser;
      console.log('👤 Current user:', currentUser ? { uid: currentUser.uid, email: currentUser.email } : 'No user logged in');
      
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
      
      // Get current location
      let location = null;
      try {
        console.log('📍 Requesting location permission...');
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status === 'granted') {
          console.log('✅ Location permission granted, getting current position...');
          const currentLocation = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
            timeout: 10000,
            maximumAge: 60000
          });
          
          location = {
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            accuracy: currentLocation.coords.accuracy,
            timestamp: currentLocation.timestamp
          };
          
          console.log('📍 Location obtained:', location);
        } else {
          console.log('⚠️ Location permission denied');
          // Still allow QR generation without location
        }
      } catch (locationError) {
        console.log('❌ Location error:', locationError);
        // Continue without location
      }

      // Generate unique session ID
      const sessionId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const expiryTime = Date.now() + (30 * 1000); // 30 seconds from now
      
      const qrSession = {
        sessionId,
        section,
        teacherId,
        createdAt: Date.now(), // Using timestamp instead of serverTimestamp for now
        expiryTime,
        location,
        active: true,
        scannedStudents: {}
      };

      console.log('📝 QR Session data prepared:', qrSession);

      // Save to Realtime Database
      const sessionsRef = ref(rtdb, `qr-sessions/${sessionId}`);
      console.log('💾 Attempting to save to Realtime Database...');
      
      await set(sessionsRef, qrSession);
      console.log('✅ QR Session saved successfully!');

      // Set auto-expire
      setTimeout(async () => {
        await this.expireSession(sessionId);
      }, 30000);

      return { sessionId, expiryTime, location };
    } catch (error) {
      console.error('❌ Error generating QR session:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  // Expire a QR session
  async expireSession(sessionId) {
    try {
      const sessionRef = ref(rtdb, `qr-sessions/${sessionId}/active`);
      await set(sessionRef, false);
    } catch (error) {
      console.error('Error expiring session:', error);
    }
  }

  // Listen to scanned students in real-time
  listenToScannedStudents(sessionId, callback) {
    const scannedRef = ref(rtdb, `qr-sessions/${sessionId}/scannedStudents`);
    onValue(scannedRef, (snapshot) => {
      const data = snapshot.val();
      const scannedStudents = data ? Object.values(data) : [];
      callback(scannedStudents);
    });

    return () => off(scannedRef);
  }

  // Calculate distance between two coordinates in meters
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180; // φ, λ in radians
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const distance = R * c; // in metres
    return distance;
  }

  // Verify student location is within acceptable range
  async verifyStudentLocation(sessionLocation, studentLocation, maxDistanceMeters = 10) {
    console.log('🔍 Location verification debug:', {
      sessionLocation: sessionLocation ? {
        lat: sessionLocation.latitude,
        lng: sessionLocation.longitude
      } : null,
      studentLocation: studentLocation ? {
        lat: studentLocation.latitude,
        lng: studentLocation.longitude
      } : null,
      maxDistanceMeters
    });

    if (!sessionLocation || !studentLocation) {
      console.log('📍 Location verification skipped - missing location data');
      console.log('  Session has location:', !!sessionLocation);
      console.log('  Student has location:', !!studentLocation);
      return { verified: false, reason: 'Location data unavailable' };
    }

    const distance = this.calculateDistance(
      sessionLocation.latitude,
      sessionLocation.longitude,
      studentLocation.latitude,
      studentLocation.longitude
    );

    const verified = distance <= maxDistanceMeters;
    
    console.log('📍 Location verification:', {
      sessionLocation,
      studentLocation,
      distance: `${distance.toFixed(2)}m`,
      maxDistance: `${maxDistanceMeters}m`,
      verified
    });

    return {
      verified,
      distance: Math.round(distance * 100) / 100, // Round to 2 decimal places
      reason: verified ? 'Within range' : `Too far (${distance.toFixed(1)}m away)`
    };
  }

  // Student scans QR code with location verification
  async scanQRCode(sessionId, studentId, studentData, studentLocation = null) {
    try {
      const sessionRef = ref(rtdb, `qr-sessions/${sessionId}`);
      
      // Check if session is still active
      return new Promise((resolve, reject) => {
        onValue(sessionRef, async (snapshot) => {
          const session = snapshot.val();
          
          if (!session || !session.active) {
            reject(new Error('QR Code not found or session is not active'));
            return;
          }

          if (Date.now() > session.expiryTime) {
            reject(new Error('QR Code has expired (>30 seconds old)'));
            return;
          }

          // Verify student's section matches the QR session section
          if (session.section !== studentData.section) {
            reject(new Error(`Section mismatch: This QR code is for section ${session.section}, but you are enrolled in section ${studentData.section}`));
            return;
          }

          // Verify location proximity (if location verification is enabled)
          const locationVerification = await this.verifyStudentLocation(
            session.location,
            studentLocation,
            10 // 10 meters max distance
          );

          // If location verification is enabled (session has location) but fails, reject
          if (session.location && !locationVerification.verified) {
            reject(new Error(`Location verification failed: You must be within 10 meters of your teacher to mark attendance (currently ${locationVerification.distance}m away)`));
            return;
          }

          // Add student to scanned list with location verification
          const scannedStudentRef = ref(rtdb, `qr-sessions/${sessionId}/scannedStudents/${studentId}`);
          await set(scannedStudentRef, {
            ...studentData,
            scannedAt: Date.now(),
            timestamp: new Date().toISOString(),
            location: studentLocation,
            locationVerification: locationVerification
          });

          resolve({
            success: true,
            message: 'Attendance marked successfully',
            locationVerification
          });
        }, { onlyOnce: true });
      });
    } catch (error) {
      console.error('Error scanning QR code:', error);
      throw error;
    }
  }

  // Finalize attendance and save to Firestore
  async finalizeAttendance(sessionId, section, teacherId) {
    try {
      const sessionRef = ref(rtdb, `qr-sessions/${sessionId}`);
      
      return new Promise((resolve, reject) => {
        onValue(sessionRef, async (snapshot) => {
          const session = snapshot.val();
          
          if (!session) {
            reject(new Error('Session not found'));
            return;
          }

          const scannedStudents = session.scannedStudents ? Object.values(session.scannedStudents) : [];
          const attendanceDate = new Date().toDateString();
          
          // Save to Firestore
          // Calculate location verification statistics
          const locationStats = scannedStudents.reduce((stats, student) => {
            if (student.locationVerification) {
              if (student.locationVerification.verified) {
                stats.verified++;
              } else {
                stats.unverified++;
              }
            } else {
              stats.noLocation++;
            }
            return stats;
          }, { verified: 0, unverified: 0, noLocation: 0 });

          const attendanceData = {
            section,
            teacherId,
            date: attendanceDate,
            timestamp: new Date(),
            sessionId,
            location: session.location,
            totalScanned: scannedStudents.length,
            scannedStudents: scannedStudents,
            method: 'qr-code',
            locationVerificationEnabled: !!session.location,
            locationStats: locationStats
          };

          await addDoc(collection(db, 'attendance-history'), attendanceData);

          // Clean up realtime database
          await remove(ref(rtdb, `qr-sessions/${sessionId}`));

          resolve(attendanceData);
        }, { onlyOnce: true });
      });
    } catch (error) {
      console.error('Error finalizing attendance:', error);
      throw error;
    }
  }

  // Get attendance history
  async getAttendanceHistory(section, teacherId) {
    try {
      const q = query(
        collection(db, 'attendance-history'),
        where('section', '==', section),
        where('teacherId', '==', teacherId),
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const history = [];
      
      querySnapshot.forEach((doc) => {
        history.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return history;
    } catch (error) {
      console.error('Error fetching attendance history:', error);
      throw error;
    }
  }

  // Check if attendance is already taken today
  async isTodayAttendanceTaken(section, teacherId) {
    try {
      const today = new Date().toDateString();
      const q = query(
        collection(db, 'attendance-history'),
        where('section', '==', section),
        where('teacherId', '==', teacherId),
        where('date', '==', today)
      );
      
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking today attendance:', error);
      return false;
    }
  }
}

export const qrService = new QRService();