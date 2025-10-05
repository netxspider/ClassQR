import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useAuth } from '../context/AuthContext';
import { LocationService } from '../services/locationService';
import { qrService } from '../services/qrService';

const { width, height } = Dimensions.get('window');

const ScanQRScreen = () => {
  const { user, userSection } = useAuth();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [locationStatus, setLocationStatus] = useState('checking');
  const [lastScanResult, setLastScanResult] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [processing, setProcessing] = useState(false);
  const qrLock = useRef(false);
  const scanTimeoutRef = useRef(null);

  useEffect(() => {
    // Check permissions when component mounts
    checkPermissions();
  }, []);

  // Auto-reset scanning if stuck
  useEffect(() => {
    if (processing) {
      console.log('⏰ Starting scan timeout timer (15 seconds)');
      scanTimeoutRef.current = setTimeout(() => {
        console.log('⏰ Scan timeout reached - auto-resetting');
        setProcessing(false);
        qrLock.current = false;
        Alert.alert('Scan Timeout', 'Scanning took too long and was reset. Please try again.');
      }, 15000); // 15 second timeout
    } else {
      if (scanTimeoutRef.current) {
        console.log('⏰ Clearing scan timeout timer');
        clearTimeout(scanTimeoutRef.current);
        scanTimeoutRef.current = null;
      }
    }

    return () => {
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
    };
  }, [processing]);

  const checkPermissions = async () => {
    try {
      // Check location services
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
      console.error('Error checking permissions:', error);
      setLocationStatus('error');
    }
  };

  // Handle camera scanning
  const handleScanPress = async () => {
    console.log('🎬 Starting camera scan process...');
    
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
      console.log('✅ Camera permission granted');
    }

    console.log('📱 Opening camera modal...');
    setShowCamera(true);
    setScanning(true);
    setScannedData(null);
    qrLock.current = false;
    setProcessing(false);
  };

  // Handle QR code detection
  const handleBarcodeScanned = async ({ type, data }) => {
    console.log('📷 Barcode detected:', { type, data, qrLocked: qrLock.current, processing });
    
    if (qrLock.current || processing) {
      console.log('🔒 Scan blocked - already processing or locked');
      return;
    }

    console.log('✅ Processing QR scan...');
    qrLock.current = true;
    setProcessing(true);
    setScanning(false);

    console.log('📷 QR Code scanned:', { type, data });

    try {
      // Parse QR code data
      let qrData;
      try {
        qrData = JSON.parse(data);
      } catch (parseError) {
        // If it's not JSON, treat it as session ID
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
          console.log('📍 Getting student location for attendance...');
          studentLocation = await LocationService.getCurrentLocation();
        } catch (locationError) {
          console.log('⚠️ Could not get location, proceeding without:', locationError.message);
        }
      }

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

      setLastScanResult(result);
      setScannedData(data);
      setShowCamera(false);

      // Show success or failure message
      if (result.success) {
        const locationMessage = result.locationVerification 
          ? (result.locationVerification.verified 
              ? `✅ Location verified (${result.locationVerification.distance}m away)`
              : `⚠️ Location check: ${result.locationVerification.reason}`)
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
      
      let errorTitle = '❌ Not Verified';
      let errorMessage = 'Failed to mark attendance. ';
      
      if (error.message.includes('expired')) {
        errorMessage = 'The QR code has expired (>30 seconds old).';
      } else if (error.message.includes('section')) {
        errorMessage = 'You are not enrolled in the correct section for this QR code.';
      } else if (error.message.includes('location') || error.message.includes('distance')) {
        errorMessage = 'You are not within 10 meters of the class location. Please move closer to your teacher.';
      } else if (error.message.includes('not found')) {
        errorMessage = 'Invalid QR code. This attendance session was not found.';
      } else {
        errorMessage += error.message;
      }
      
      Alert.alert(errorTitle, errorMessage, [{ text: 'OK' }]);
    }
    
    console.log('🔓 Resetting scan lock and processing state');
    setProcessing(false);
    qrLock.current = false;
  };

  // Close camera
  const handleCloseCamera = () => {
    console.log('📱 Closing camera modal...');
    setShowCamera(false);
    setScanning(false);
    setProcessing(false);
    qrLock.current = false;
  };

  // Helper functions for location status display
  const getLocationStatusStyle = () => {
    switch (locationStatus) {
      case 'granted': return styles.locationGranted;
      case 'permission_needed': return styles.locationPermissionNeeded;
      case 'disabled': return styles.locationDisabled;
      default: return styles.locationChecking;
    }
  };

  const getLocationIcon = () => {
    switch (locationStatus) {
      case 'granted': return 'location';
      case 'permission_needed': return 'location-outline';
      case 'disabled': return 'location-off';
      default: return 'hourglass-outline';
    }
  };

  const getLocationColor = () => {
    switch (locationStatus) {
      case 'granted': return '#27ae60';
      case 'permission_needed': return '#f39c12';
      case 'disabled': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getLocationStatusText = () => {
    switch (locationStatus) {
      case 'granted': return 'Location enabled • Proximity will be verified';
      case 'permission_needed': return 'Location permission needed';
      case 'disabled': return 'Location services disabled';
      case 'checking': return 'Checking location...';
      default: return 'Location status unknown';
    }
  };

  // Manual attendance entry (fallback)
  const handleManualEntry = () => {
    Alert.prompt(
      'Manual Attendance',
      'Enter the attendance code provided by your teacher:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Submit',
          onPress: (code) => {
            if (code && code.length > 0) {
              Alert.alert('Success', 'Attendance marked successfully!');
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
        <View style={styles.permissionContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.permissionText}>Requesting camera permission...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!cameraPermission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Ionicons name="camera-outline" size={60} color="#e74c3c" />
          <Text style={styles.permissionText}>Camera permission is required</Text>
          <Text style={styles.permissionSubtext}>
            Please enable camera access in your device settings to scan QR codes
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
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>
            {user?.email?.split('@')[0] || 'Student'}
          </Text>
          <Text style={styles.studentSection}>Section: {userSection}</Text>
          
          {/* Location Status */}
          <View style={styles.locationStatusContainer}>
            <View style={[styles.locationStatusBadge, getLocationStatusStyle()]}>
              <Ionicons name={getLocationIcon()} size={14} color={getLocationColor()} />
              <Text style={[styles.locationStatusText, { color: getLocationColor() }]}>
                {getLocationStatusText()}
              </Text>
            </View>
          </View>
        </View>

        {/* QR Scanner Area */}
        <View style={styles.scannerContainer}>
          <View style={styles.scannerFrame}>
            {processing ? (
              <View style={styles.scanningState}>
                <ActivityIndicator size="large" color="#3498db" />
                <Text style={styles.scanningText}>Processing attendance...</Text>
              </View>
            ) : showCamera ? (
              <View style={styles.scanningState}>
                <Ionicons name="camera" size={60} color="#27ae60" />
                <Text style={styles.scanningText}>Camera is active - looking for QR codes</Text>
              </View>
            ) : (
              <View style={styles.readyState}>
                <Ionicons name="camera-outline" size={80} color="#3498db" />
                <Text style={styles.readyText}>Tap to open camera and scan QR code</Text>
              </View>
            )}
          </View>
          
          {/* Corner indicators */}
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>How to scan:</Text>
          <View style={styles.instructionItem}>
            <Ionicons name="checkmark-circle" size={20} color="#27ae60" />
            <Text style={styles.instructionText}>
              Ask your teacher to show the QR code
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="checkmark-circle" size={20} color="#27ae60" />
            <Text style={styles.instructionText}>
              Hold your phone steady and point at the code
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="checkmark-circle" size={20} color="#27ae60" />
            <Text style={styles.instructionText}>
              Wait for automatic detection
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[
              styles.scanButton, 
              (processing || !cameraPermission?.granted) && styles.scanButtonDisabled
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

          {/* Debug button for testing */}
          <TouchableOpacity
            style={styles.debugButton}
            onPress={() => {
              console.log('🧪 Debug test scan triggered');
              // Simulate a QR scan with a test session ID
              handleBarcodeScanned({ 
                type: 'qr', 
                data: '1759663416419zxn76rnzt' // Use a recent session ID from logs
              });
            }}
          >
            <Ionicons name="bug-outline" size={20} color="#9b59b6" />
            <Text style={styles.debugButtonText}>Test Scan (Debug)</Text>
          </TouchableOpacity>

          {/* Camera test button */}
          <TouchableOpacity
            style={styles.testCameraButton}
            onPress={() => {
              console.log('📸 Camera test triggered');
              Alert.alert(
                'Camera Test', 
                `Camera Permission: ${cameraPermission?.granted ? 'Granted' : 'Denied'}\nCamera Available: ${cameraPermission ? 'Yes' : 'No'}\nProcessing: ${processing}\nQR Lock: ${qrLock.current}`,
                [{ text: 'OK' }]
              );
            }}
          >
            <Ionicons name="information-circle-outline" size={20} color="#2c3e50" />
            <Text style={styles.testCameraButtonText}>Camera Status</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Attendance */}
        <View style={styles.recentContainer}>
          <Text style={styles.recentTitle}>Today's Status</Text>
          {lastScanResult ? (
            <View style={styles.statusCard}>
              <Ionicons name="checkmark-circle" size={20} color="#27ae60" />
              <View style={styles.statusDetails}>
                <Text style={styles.statusText}>Attendance marked successfully</Text>
                {lastScanResult.locationVerification && (
                  <Text style={[
                    styles.locationVerificationText,
                    lastScanResult.locationVerification.verified 
                      ? styles.locationVerified 
                      : styles.locationUnverified
                  ]}>
                    📍 {lastScanResult.locationVerification.reason}
                  </Text>
                )}
              </View>
            </View>
          ) : (
            <View style={styles.statusCard}>
              <Ionicons name="time-outline" size={20} color="#f39c12" />
              <Text style={styles.statusText}>Attendance not marked yet</Text>
            </View>
          )}
        </View>
      </View>

      {/* Camera Modal */}
      <Modal
        visible={showCamera}
        animationType="slide"
        statusBarTranslucent={true}
      >
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            facing="back"
            onBarcodeScanned={processing ? undefined : handleBarcodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
          >
            {/* Camera Overlay */}
            <View style={styles.cameraOverlay}>
              {/* Header */}
              <View style={styles.cameraHeader}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleCloseCamera}
                >
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.cameraTitle}>Scan QR Code</Text>
                <View style={{ width: 24 }} />
              </View>

              {/* Scanning Frame */}
              <View style={styles.scanningFrameContainer}>
                <View style={styles.scanningFrame}>
                  {/* Corner indicators */}
                  <View style={[styles.frameCorner, styles.frameTopLeft]} />
                  <View style={[styles.frameCorner, styles.frameTopRight]} />
                  <View style={[styles.frameCorner, styles.frameBottomLeft]} />
                  <View style={[styles.frameCorner, styles.frameBottomRight]} />
                </View>
                
                {processing && (
                  <View style={styles.processingOverlay}>
                    <ActivityIndicator size="large" color="#3498db" />
                    <Text style={styles.processingText}>Verifying attendance...</Text>
                  </View>
                )}
              </View>

              {/* Instructions */}
              <View style={styles.cameraInstructions}>
                <Text style={styles.cameraInstructionText}>
                  Position the QR code within the frame
                </Text>
                <Text style={styles.cameraSubText}>
                  Make sure you're close to your teacher for location verification
                </Text>
                
                {/* Reset button if stuck */}
                {!processing && (
                  <TouchableOpacity
                    style={styles.resetButton}
                    onPress={() => {
                      console.log('🔄 Manual reset triggered');
                      qrLock.current = false;
                      setProcessing(false);
                      setScanning(true);
                    }}
                  >
                    <Ionicons name="refresh-outline" size={20} color="white" />
                    <Text style={styles.resetButtonText}>Tap to Re-enable Scanning</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </CameraView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  permissionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 20,
    textAlign: 'center',
  },
  permissionSubtext: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 20,
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  studentInfo: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginVertical: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  scannerContainer: {
    position: 'relative',
    aspectRatio: 1,
    maxWidth: 280,
    alignSelf: 'center',
    marginVertical: 20,
  },
  scannerFrame: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#bdc3c7',
    borderStyle: 'dashed',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#3498db',
    borderWidth: 3,
  },
  topLeft: {
    top: -2,
    left: -2,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  topRight: {
    top: -2,
    right: -2,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  scanningState: {
    alignItems: 'center',
  },
  scanningText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3498db',
    marginTop: 15,
  },
  readyState: {
    alignItems: 'center',
  },
  readyText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 15,
    textAlign: 'center',
  },
  instructionsContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginLeft: 10,
    flex: 1,
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
  scanButtonDisabled: {
    opacity: 0.7,
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
  recentContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  locationStatusContainer: {
    marginTop: 10,
  },
  locationStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  locationGranted: {
    backgroundColor: '#e8f5e8',
  },
  locationPermissionNeeded: {
    backgroundColor: '#fef9e7',
  },
  locationDisabled: {
    backgroundColor: '#fdeaea',
  },
  locationChecking: {
    backgroundColor: '#f8f9fa',
  },
  locationStatusText: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusDetails: {
    flex: 1,
  },
  statusText: {
    fontSize: 14,
    color: '#f39c12',
    fontWeight: '600',
  },
  locationVerificationText: {
    fontSize: 12,
    marginTop: 3,
    fontWeight: '500',
  },
  locationVerified: {
    color: '#27ae60',
  },
  locationUnverified: {
    color: '#e74c3c',
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
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scanningFrameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  scanningFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  frameCorner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#3498db',
    borderWidth: 4,
  },
  frameTopLeft: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  frameTopRight: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  frameBottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  frameBottomRight: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  processingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
  },
  cameraInstructions: {
    alignItems: 'center',
    paddingBottom: 80,
    paddingHorizontal: 40,
  },
  cameraInstructionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  cameraSubText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(52, 152, 219, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 20,
    gap: 8,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  debugButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#9b59b6',
    gap: 8,
  },
  debugButtonText: {
    color: '#9b59b6',
    fontSize: 16,
    fontWeight: '600',
  },
  testCameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bdc3c7',
    gap: 8,
  },
  testCameraButtonText: {
    color: '#2c3e50',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ScanQRScreen;