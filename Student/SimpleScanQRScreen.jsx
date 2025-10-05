import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useAuth } from '../context/AuthContext';
import { LocationService } from '../services/locationService';
import { qrService } from '../services/qrService';

const SimpleScanQRScreen = () => {
  const { user, userSection } = useAuth();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [locationStatus, setLocationStatus] = useState('checking');

  useEffect(() => {
    // Check location permissions on mount
    checkLocationPermissions();
  }, []);

  const checkLocationPermissions = async () => {
    try {
      const locationEnabled = await LocationService.isLocationEnabled();
      const locationPermission = await LocationService.getLocationPermission();
      
      console.log('📍 Location status:', { locationEnabled, locationPermission });
      
      if (!locationEnabled) {
        setLocationStatus('disabled');
      } else if (locationPermission !== 'granted') {
        setLocationStatus('permission_needed');
      } else {
        setLocationStatus('granted');
      }
    } catch (error) {
      console.error('Error checking location permissions:', error);
      setLocationStatus('error');
    }
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    if (scanned || processing) {
      console.log('🔒 Scan blocked - already processing');
      return;
    }

    console.log('📷 QR Code detected:', { type, data });
    setScanned(true);
    setProcessing(true);

    try {
      // Parse QR code data
      let qrData;
      try {
        qrData = JSON.parse(data);
      } catch (parseError) {
        qrData = { sessionId: data };
      }

      const sessionId = qrData.sessionId;
      if (!sessionId) {
        throw new Error('Invalid QR code format');
      }

      // Get student location
      let studentLocation = null;
      if (locationStatus === 'granted') {
        try {
          console.log('📍 Getting student location...');
          studentLocation = await LocationService.getCurrentLocation();
          console.log('📍 Student location obtained:', studentLocation);
        } catch (locationError) {
          console.log('⚠️ Could not get location:', locationError.message);
          // Try to request location permission again
          try {
            await LocationService.requestLocationPermission();
            studentLocation = await LocationService.getCurrentLocation();
            console.log('📍 Student location obtained after permission retry:', studentLocation);
          } catch (retryError) {
            console.log('❌ Failed to get location after retry:', retryError.message);
          }
        }
      } else {
        console.log('📍 Location permission not granted, trying to request...');
        try {
          const permissionStatus = await LocationService.requestLocationPermission();
          console.log('📍 Permission request result:', permissionStatus);
          
          if (permissionStatus === 'granted') {
            console.log('📍 Permission granted, checking location services...');
            const locationEnabled = await LocationService.isLocationEnabled();
            console.log('📍 Location services enabled:', locationEnabled);
            
            if (locationEnabled) {
              studentLocation = await LocationService.getCurrentLocation();
              setLocationStatus('granted');
              console.log('📍 Student location obtained after permission request:', studentLocation);
            } else {
              console.log('❌ Location services disabled on device');
            }
          } else {
            console.log('❌ Location permission not granted:', permissionStatus);
          }
        } catch (locationError) {
          console.log('❌ Could not get location permission or location:', {
            message: locationError.message,
            name: locationError.name,
            stack: locationError.stack
          });
        }
      }

      // Debug log before QR scan
      console.log('🎯 About to scan QR with data:', {
        sessionId,
        studentId: user.uid,
        userSection,
        studentLocation: studentLocation ? {
          lat: studentLocation.latitude,
          lng: studentLocation.longitude,
          accuracy: studentLocation.accuracy
        } : null
      });

      // Process the scanned QR code
      const result = await qrService.scanQRCode(
        sessionId,
        user.uid,
        {
          id: user.uid,
          email: user.email,
          name: user.displayName || user.email?.split('@')[0],
          section: userSection
        },
        studentLocation
      );

      setShowCamera(false);

      if (result.success) {
        const locationMessage = result.locationVerification 
          ? (result.locationVerification.verified 
              ? `✅ Location verified (${result.locationVerification.distance}m away)`
              : `⚠️ Location: ${result.locationVerification.reason}`)
          : '📍 No location verification';
        
        Alert.alert(
          '✅ Attendance Marked Successfully!',
          `Your attendance has been recorded.\n\n${locationMessage}`,
          [{ text: 'OK' }]
        );
      } else {
        throw new Error(result.message || 'Failed to mark attendance');
      }

    } catch (error) {
      console.error('❌ QR Scan Error:', error);
      setShowCamera(false);
      
      let errorMessage = 'Failed to mark attendance. ';
      
      if (error.message.includes('expired')) {
        errorMessage = 'The QR code has expired (>30 seconds old).';
      } else if (error.message.includes('section')) {
        errorMessage = 'You are not enrolled in the correct section for this QR code.';
      } else if (error.message.includes('location') || error.message.includes('distance')) {
        errorMessage = 'You are not within 10 meters of the class location.';
      } else if (error.message.includes('not found')) {
        errorMessage = 'Invalid QR code. This attendance session was not found.';
      } else {
        errorMessage += error.message;
      }
      
      Alert.alert('❌ Not Verified', errorMessage, [{ text: 'OK' }]);
    }
    
    setProcessing(false);
    setScanned(false);
  };

  const handleScanPress = async () => {
    console.log('🎯 Starting camera scan...');
    
    if (!cameraPermission) {
      console.log('❌ No camera permission object');
      return;
    }

    if (!cameraPermission.granted) {
      console.log('📸 Requesting camera permission...');
      const permission = await requestCameraPermission();
      if (!permission.granted) {
        console.log('❌ Camera permission denied');
        Alert.alert('Camera Permission Required', 'Please grant camera permission to scan QR codes.');
        return;
      }
    }

    console.log('✅ Opening camera...');
    setShowCamera(true);
    setScanned(false);
    setProcessing(false);
  };

  const handleCloseCamera = () => {
    console.log('📱 Closing camera...');
    setShowCamera(false);
    setScanned(false);
    setProcessing(false);
  };

  const handleManualEntry = () => {
    Alert.prompt(
      'Manual Attendance',
      'Enter the attendance code provided by your teacher:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: (code) => {
            if (code && code.length > 0) {
              handleBarCodeScanned({ type: 'qr', data: code });
            } else {
              Alert.alert('Error', 'Please enter a valid code');
            }
          },
        },
      ],
      'plain-text'
    );
  };

  if (!cameraPermission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.messageText}>Requesting camera permission...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!cameraPermission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Ionicons name="camera-off-outline" size={80} color="#e74c3c" />
          <Text style={styles.messageText}>Camera permission required</Text>
          <Text style={styles.subText}>
            Please enable camera access to scan QR codes for attendance
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestCameraPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Camera Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Scan QR Code</Text>
        <Text style={styles.subtitle}>Mark your attendance</Text>
      </View>

      <View style={styles.content}>
        {/* Student Info */}
        <View style={styles.infoCard}>
          <Text style={styles.studentName}>
            {user?.email?.split('@')[0] || 'Student'}
          </Text>
          <Text style={styles.studentSection}>Section: {userSection}</Text>
          
          <View style={styles.locationBadge}>
            <Ionicons 
              name={locationStatus === 'granted' ? 'location' : 'location-outline'} 
              size={16} 
              color={locationStatus === 'granted' ? '#27ae60' : '#e74c3c'} 
            />
            <Text style={[styles.locationText, {
              color: locationStatus === 'granted' ? '#27ae60' : '#e74c3c'
            }]}>
              Location: {locationStatus === 'granted' ? 'Enabled' : 'Disabled'}
            </Text>
            {locationStatus !== 'granted' && (
              <TouchableOpacity
                style={styles.locationButton}
                onPress={async () => {
                  try {
                    await LocationService.requestLocationPermission();
                    checkLocationPermissions();
                  } catch (error) {
                    Alert.alert('Location Error', 'Could not enable location services. Please enable in device settings.');
                  }
                }}
              >
                <Text style={styles.locationButtonText}>Enable</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Scanner Preview */}
        <View style={styles.scannerPreview}>
          {processing ? (
            <View style={styles.processingView}>
              <ActivityIndicator size="large" color="#3498db" />
              <Text style={styles.processingText}>Processing QR code...</Text>
            </View>
          ) : (
            <View style={styles.readyView}>
              <Ionicons name="qr-code-outline" size={80} color="#3498db" />
              <Text style={styles.readyText}>Ready to scan</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[
              styles.scanButton, 
              (processing || !cameraPermission?.granted) && styles.disabledButton
            ]}
            onPress={handleScanPress}
            disabled={processing || !cameraPermission?.granted}
          >
            <Ionicons 
              name={processing ? "hourglass-outline" : 
                    !cameraPermission?.granted ? "camera-off-outline" : "camera-outline"} 
              size={24} 
              color="white" 
            />
            <Text style={styles.scanButtonText}>
              {processing ? 'Processing...' : 
               !cameraPermission?.granted ? 'Grant Camera Permission' : 'Open Camera to Scan'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.manualButton}
            onPress={handleManualEntry}
          >
            <Ionicons name="keypad-outline" size={20} color="#7f8c8d" />
            <Text style={styles.manualButtonText}>Enter Code Manually</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Camera Modal */}
      <Modal visible={showCamera} animationType="slide" statusBarTranslucent={true}>
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
        >
          <View style={styles.cameraOverlay}>
            {/* Header */}
            <View style={styles.cameraHeader}>
              <TouchableOpacity style={styles.closeButton} onPress={handleCloseCamera}>
                <Ionicons name="close" size={28} color="white" />
              </TouchableOpacity>
              <Text style={styles.cameraTitle}>Scan QR Code</Text>
              <View style={{ width: 28 }} />
            </View>

            {/* Scanning area */}
            <View style={styles.scanningArea}>
              <View style={styles.scanFrame}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
              </View>
              
              {processing && (
                <View style={styles.processingOverlay}>
                  <ActivityIndicator size="large" color="white" />
                  <Text style={styles.processingOverlayText}>Verifying...</Text>
                </View>
              )}
            </View>

            {/* Instructions */}
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionText}>
                Position the QR code within the frame
              </Text>
              <Text style={styles.instructionSubText}>
                Make sure you're close to your teacher
              </Text>
              
              {scanned && !processing && (
                <TouchableOpacity
                  style={styles.scanAgainButton}
                  onPress={() => setScanned(false)}
                >
                  <Text style={styles.scanAgainText}>Tap to scan again</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </CameraView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  messageText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 20,
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginVertical: 20,
    alignItems: 'center',
  },
  studentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  studentSection: {
    fontSize: 16,
    color: '#3498db',
    marginTop: 5,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  scannerPreview: {
    aspectRatio: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingView: {
    alignItems: 'center',
  },
  processingText: {
    fontSize: 16,
    color: '#3498db',
    marginTop: 15,
    fontWeight: '600',
  },
  readyView: {
    alignItems: 'center',
  },
  readyText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 15,
  },
  buttonsContainer: {
    gap: 15,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db',
    paddingVertical: 15,
    borderRadius: 12,
    gap: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  manualButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bdc3c7',
    gap: 8,
  },
  manualButtonText: {
    color: '#7f8c8d',
    fontSize: 16,
    fontWeight: '600',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  cameraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scanningArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#3498db',
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  processingOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 15,
    padding: 20,
  },
  processingOverlayText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
  instructionsContainer: {
    alignItems: 'center',
    paddingBottom: 60,
    paddingHorizontal: 40,
  },
  instructionText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  instructionSubText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    textAlign: 'center',
  },
  scanAgainButton: {
    backgroundColor: 'rgba(52, 152, 219, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  scanAgainText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  permissionButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  locationButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  locationButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default SimpleScanQRScreen;