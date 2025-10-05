import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';

const { width } = Dimensions.get('window');

const QRGenerator = ({ visible, onClose, sessionData, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (!visible || !sessionData) return;

    setTimeLeft(30);
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [visible, sessionData]);

  if (!sessionData) return null;

  const qrData = JSON.stringify({
    sessionId: sessionData.sessionId,
    section: sessionData.section,
    timestamp: Date.now(),
    location: sessionData.location,
    expiresAt: sessionData.expiryTime
  });

  // Debug: Log the QR data to console
  console.log('🎯 QR Code generated with data:', JSON.parse(qrData));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>QR Code for Attendance</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#7f8c8d" />
            </TouchableOpacity>
          </View>

          <View style={styles.qrContainer}>
            <QRCode
              value={qrData}
              size={width * 0.6}
              backgroundColor="white"
              color="black"
            />
          </View>

          <View style={styles.timerContainer}>
            <View style={[
              styles.timerCircle,
              { borderColor: timeLeft > 10 ? '#27ae60' : '#e74c3c' }
            ]}>
              <Text style={[
                styles.timerText,
                { color: timeLeft > 10 ? '#27ae60' : '#e74c3c' }
              ]}>
                {timeLeft}
              </Text>
            </View>
            <Text style={styles.timerLabel}>Seconds remaining</Text>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Ionicons name="school" size={16} color="#7f8c8d" />
              <Text style={styles.infoText}>Section: {sessionData.section}</Text>
            </View>
            {sessionData.location && (
              <View style={styles.infoRow}>
                <Ionicons name="location" size={16} color="#27ae60" />
                <Text style={styles.infoText}>
                  Location secured • Accuracy: ±{sessionData.location.accuracy?.toFixed(0) || '?'}m
                </Text>
              </View>
            )}
            {!sessionData.location && (
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={16} color="#e67e22" />
                <Text style={[styles.infoText, { color: '#e67e22' }]}>
                  No location • Proximity check disabled
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.instructionText}>
            Students should scan this QR code to mark their attendance
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: width * 0.9,
    maxHeight: '80%',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  closeButton: {
    padding: 5,
  },
  qrContainer: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    marginBottom: 20,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  timerLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  infoContainer: {
    width: '100%',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  instructionText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default QRGenerator;