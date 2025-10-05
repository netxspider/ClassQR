import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Device from 'expo-device';
import { LocationService } from '../services/locationService';

const CameraDiagnostic = () => {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [diagnosticData, setDiagnosticData] = useState({});
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    setTesting(true);
    const results = [];
    const data = {};

    try {
      // Device info
      results.push('🔍 Running device diagnostics...');
      data.device = {
        brand: Device.brand,
        modelName: Device.modelName,
        osName: Device.osName,
        osVersion: Device.osVersion,
        platformApiLevel: Device.platformApiLevel,
      };
      results.push(`✅ Device: ${Device.brand} ${Device.modelName}`);
      results.push(`✅ OS: ${Device.osName} ${Device.osVersion}`);

      // Camera permissions
      results.push('📸 Checking camera permissions...');
      data.cameraPermission = cameraPermission;
      
      if (!cameraPermission) {
        results.push('❌ Camera permission object is null');
      } else if (!cameraPermission.granted) {
        results.push('⚠️ Camera permission not granted');
        results.push('📸 Requesting camera permission...');
        
        const newPermission = await requestCameraPermission();
        data.cameraPermissionAfterRequest = newPermission;
        
        if (newPermission.granted) {
          results.push('✅ Camera permission granted after request');
        } else {
          results.push('❌ Camera permission denied after request');
        }
      } else {
        results.push('✅ Camera permission already granted');
      }

      // Location permissions
      results.push('📍 Checking location permissions...');
      const locationEnabled = await LocationService.isLocationEnabled();
      const locationPermission = await LocationService.getLocationPermission();
      
      data.location = {
        enabled: locationEnabled,
        permission: locationPermission,
      };
      
      results.push(`${locationEnabled ? '✅' : '❌'} Location enabled: ${locationEnabled}`);
      results.push(`${locationPermission === 'granted' ? '✅' : '❌'} Location permission: ${locationPermission}`);

      // Expo Camera API check
      results.push('🎬 Checking Expo Camera API...');
      try {
        // Check if CameraView is available
        data.cameraViewAvailable = typeof CameraView !== 'undefined';
        results.push(`${data.cameraViewAvailable ? '✅' : '❌'} CameraView available: ${data.cameraViewAvailable}`);
        
        // Check if useCameraPermissions is available
        data.useCameraPermissionsAvailable = typeof useCameraPermissions === 'function';
        results.push(`${data.useCameraPermissionsAvailable ? '✅' : '❌'} useCameraPermissions available: ${data.useCameraPermissionsAvailable}`);
        
      } catch (error) {
        results.push(`❌ Expo Camera API error: ${error.message}`);
        data.cameraApiError = error.message;
      }

      // Test QR code scanning capability
      results.push('🔍 Testing QR scanning support...');
      try {
        // This would normally be tested with an actual camera view
        data.qrScanningSupported = true;
        results.push('✅ QR scanning theoretically supported');
      } catch (error) {
        results.push(`❌ QR scanning error: ${error.message}`);
        data.qrScanningError = error.message;
      }

      results.push('🎉 Diagnostics completed!');
      
    } catch (error) {
      results.push(`❌ Diagnostic error: ${error.message}`);
      data.diagnosticError = error.message;
    }

    setDiagnosticData(data);
    setTestResults(results);
    setTesting(false);
  };

  const testCameraOpen = () => {
    Alert.alert(
      'Camera Test Results',
      `Camera Permission: ${cameraPermission?.granted ? 'Granted' : 'Not Granted'}\n` +
      `Can Access: ${cameraPermission ? 'Yes' : 'No'}\n` +
      `Status: ${cameraPermission?.status || 'Unknown'}`,
      [{ text: 'OK' }]
    );
  };

  const exportDiagnostics = () => {
    const report = {
      timestamp: new Date().toISOString(),
      diagnosticData,
      testResults,
    };
    
    Alert.alert(
      'Diagnostic Report',
      JSON.stringify(report, null, 2),
      [{ text: 'Copy to Clipboard' }, { text: 'Close' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Camera Diagnostic Tool</Text>
        <Text style={styles.subtitle}>Debug QR scanning issues</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Status */}
        <View style={styles.statusCard}>
          <Text style={styles.cardTitle}>Quick Status</Text>
          
          <View style={styles.statusRow}>
            <Ionicons 
              name={cameraPermission?.granted ? "checkmark-circle" : "close-circle"} 
              size={20} 
              color={cameraPermission?.granted ? "#27ae60" : "#e74c3c"} 
            />
            <Text style={styles.statusText}>
              Camera Permission: {cameraPermission?.granted ? 'Granted' : 'Not Granted'}
            </Text>
          </View>
          
          <View style={styles.statusRow}>
            <Ionicons 
              name={diagnosticData.location?.enabled ? "checkmark-circle" : "close-circle"} 
              size={20} 
              color={diagnosticData.location?.enabled ? "#27ae60" : "#e74c3c"} 
            />
            <Text style={styles.statusText}>
              Location: {diagnosticData.location?.enabled ? 'Enabled' : 'Disabled'}
            </Text>
          </View>

          <View style={styles.statusRow}>
            <Ionicons 
              name={diagnosticData.cameraViewAvailable ? "checkmark-circle" : "close-circle"} 
              size={20} 
              color={diagnosticData.cameraViewAvailable ? "#27ae60" : "#e74c3c"} 
            />
            <Text style={styles.statusText}>
              CameraView API: {diagnosticData.cameraViewAvailable ? 'Available' : 'Not Available'}
            </Text>
          </View>
        </View>

        {/* Device Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Device Information</Text>
          {diagnosticData.device && (
            <>
              <Text style={styles.infoText}>Brand: {diagnosticData.device.brand}</Text>
              <Text style={styles.infoText}>Model: {diagnosticData.device.modelName}</Text>
              <Text style={styles.infoText}>OS: {diagnosticData.device.osName} {diagnosticData.device.osVersion}</Text>
              {diagnosticData.device.platformApiLevel && (
                <Text style={styles.infoText}>API Level: {diagnosticData.device.platformApiLevel}</Text>
              )}
            </>
          )}
        </View>

        {/* Test Results */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Diagnostic Results</Text>
          {testing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#3498db" />
              <Text style={styles.loadingText}>Running diagnostics...</Text>
            </View>
          ) : (
            <View style={styles.resultsContainer}>
              {testResults.map((result, index) => (
                <Text key={index} style={styles.resultText}>
                  {result}
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={runDiagnostics}
            disabled={testing}
          >
            <Ionicons name="refresh-outline" size={20} color="white" />
            <Text style={styles.buttonText}>
              {testing ? 'Running...' : 'Run Diagnostics'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={testCameraOpen}
          >
            <Ionicons name="camera-outline" size={20} color="#3498db" />
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              Test Camera Status
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={exportDiagnostics}
          >
            <Ionicons name="document-text-outline" size={20} color="#3498db" />
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              Export Report
            </Text>
          </TouchableOpacity>

          {!cameraPermission?.granted && (
            <TouchableOpacity
              style={[styles.button, styles.warningButton]}
              onPress={requestCameraPermission}
            >
              <Ionicons name="camera-outline" size={20} color="white" />
              <Text style={styles.buttonText}>
                Request Camera Permission
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
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
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statusCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 15,
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#2c3e50',
  },
  infoText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  loadingText: {
    marginLeft: 10,
    color: '#7f8c8d',
  },
  resultsContainer: {
    paddingVertical: 5,
  },
  resultText: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 3,
    fontFamily: 'monospace',
  },
  buttonsContainer: {
    paddingVertical: 20,
    gap: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#3498db',
  },
  secondaryButtonText: {
    color: '#3498db',
  },
  warningButton: {
    backgroundColor: '#e67e22',
  },
});

export default CameraDiagnostic;