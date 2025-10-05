import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { qrService } from '../services/qrService';
import QRGenerator from '../components/QRGenerator';
import { testFirebaseRTDB } from '../utils/testFirebase';

const AttendanceScreen = ({ navigation }) => {
  const { userSection, user } = useAuth();
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [todayTaken, setTodayTaken] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [qrSessionData, setQrSessionData] = useState(null);
  const [generatingQR, setGeneratingQR] = useState(false);

  // Get today's date
  const getTodayDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Load attendance data
  const loadAttendanceData = async () => {
    try {
      setLoading(true);
      
      const [history, isTaken] = await Promise.all([
        qrService.getAttendanceHistory(userSection, user.uid),
        qrService.isTodayAttendanceTaken(userSection, user.uid)
      ]);
      
      setAttendanceHistory(history);
      setTodayTaken(isTaken);
    } catch (error) {
      console.error('Error loading attendance:', error);
      Alert.alert('Error', 'Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  // Refresh data
  const onRefresh = async () => {
    setRefreshing(true);
    await loadAttendanceData();
    setRefreshing(false);
  };

  useEffect(() => {
    if (userSection && user) {
      loadAttendanceData();
    }
  }, [userSection, user]);

  // Test Firebase connection
  const handleTestFirebase = async () => {
    try {
      const result = await testFirebaseRTDB();
      if (result) {
        Alert.alert('Success', 'Firebase Realtime Database connection is working!');
      } else {
        Alert.alert('Failed', 'Firebase Realtime Database test failed. Check console for details.');
      }
    } catch (error) {
      console.error('Test error:', error);
      Alert.alert('Error', `Test failed: ${error.message}`);
    }
  };

  // Generate QR Code
  const handleGenerateQR = async () => {
    try {
      setGeneratingQR(true);
      console.log('🎯 Generate QR button pressed');
      
      const sessionData = await qrService.generateQRSession(userSection, user.uid);
      
      setQrSessionData({
        sessionId: sessionData.sessionId,
        section: userSection,
        expiryTime: sessionData.expiryTime,
        location: sessionData.location
      });
      setShowQR(true);
    } catch (error) {
      console.error('Error generating QR:', error);
      
      let errorMessage = 'Failed to generate QR code';
      if (error.message.includes('PERMISSION_DENIED')) {
        errorMessage = 'Database permission denied. Please update Firebase Realtime Database rules.';
      } else if (error.message.includes('not authenticated')) {
        errorMessage = 'Please log out and log back in.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setGeneratingQR(false);
    }
  };

  // Handle QR expiry
  const handleQRExpiry = () => {
    setShowQR(false);
    // Navigate to Mark Attendance screen
    navigation.navigate('MarkAttendance', {
      sessionId: qrSessionData.sessionId,
      section: userSection,
      teacherId: user.uid
    });
  };

  // Render attendance history item
  const renderHistoryItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.historyItem}
      onPress={() => {
        Alert.alert(
          'Attendance Details',
          `Date: ${item.date}\nStudents Scanned: ${item.totalScanned}\nMethod: ${item.method}\nTime: ${new Date(item.timestamp?.seconds ? item.timestamp.seconds * 1000 : item.timestamp).toLocaleString()}`,
          [{ text: 'OK' }]
        );
      }}
    >
      <View style={styles.historyInfo}>
        <Text style={styles.historyDate}>{item.date}</Text>
        <Text style={styles.historyDetails}>
          {item.totalScanned} students • {item.method === 'qr-code' ? 'QR Code' : 'Manual'}
        </Text>
        <Text style={styles.historyTime}>
          {new Date(item.timestamp?.seconds ? item.timestamp.seconds * 1000 : item.timestamp).toLocaleTimeString()}
        </Text>
      </View>
      
      <View style={styles.historyStats}>
        <View style={styles.statBadge}>
          <Text style={styles.statBadgeText}>{item.totalScanned}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#bdc3c7" />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#27ae60" />
          <Text style={styles.loadingText}>Loading attendance...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Attendance</Text>
          <Text style={styles.dateText}>{getTodayDate()}</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Take Today's Attendance Section */}
        <View style={styles.todaySection}>
          <Text style={styles.sectionTitle}>Today's Attendance</Text>
          
          {todayTaken ? (
            <View style={styles.alreadyTakenCard}>
              <Ionicons name="checkmark-circle" size={40} color="#27ae60" />
              <Text style={styles.alreadyTakenText}>Attendance already taken today</Text>
              <Text style={styles.alreadyTakenSubtext}>
                Check history below for details
              </Text>
            </View>
          ) : (
            <View style={styles.takeAttendanceCard}>
              <Ionicons name="qr-code" size={40} color="#3498db" />
              <Text style={styles.takeAttendanceText}>Ready to take attendance</Text>
              <Text style={styles.takeAttendanceSubtext}>
                Generate a QR code for students to scan
              </Text>
              <TouchableOpacity 
                style={styles.generateButton}
                onPress={handleGenerateQR}
                disabled={generatingQR}
              >
                {generatingQR ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Ionicons name="qr-code" size={20} color="white" />
                )}
                <Text style={styles.generateButtonText}>
                  {generatingQR ? 'Generating...' : 'Generate QR Code'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.testButton}
                onPress={handleTestFirebase}
              >
                <Ionicons name="bug" size={16} color="#e67e22" />
                <Text style={styles.testButtonText}>Test Database</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Attendance History */}
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Text style={styles.sectionTitle}>Attendance History</Text>
            <Text style={styles.historyCount}>
              {attendanceHistory.length} records
            </Text>
          </View>

          {attendanceHistory.length === 0 ? (
            <View style={styles.noHistoryContainer}>
              <Ionicons name="calendar-outline" size={60} color="#bdc3c7" />
              <Text style={styles.noHistoryText}>No attendance history</Text>
              <Text style={styles.noHistorySubtext}>
                Start taking attendance to see history here
              </Text>
            </View>
          ) : (
            <FlatList
              data={attendanceHistory}
              renderItem={renderHistoryItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </ScrollView>

      {/* QR Generator Modal */}
      <QRGenerator
        visible={showQR}
        onClose={() => setShowQR(false)}
        sessionData={qrSessionData}
        onExpire={handleQRExpiry}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7f8c8d',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
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
  dateText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  todaySection: {
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  alreadyTakenCard: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  alreadyTakenText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#27ae60',
    marginTop: 10,
  },
  alreadyTakenSubtext: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
    textAlign: 'center',
  },
  takeAttendanceCard: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  takeAttendanceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 10,
  },
  takeAttendanceSubtext: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
    textAlign: 'center',
    marginBottom: 20,
  },
  generateButton: {
    backgroundColor: '#3498db',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    minWidth: 160,
    justifyContent: 'center',
  },
  generateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  testButton: {
    backgroundColor: '#f39c12',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
    justifyContent: 'center',
    marginTop: 10,
  },
  testButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  historySection: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  historyCount: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  noHistoryContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  noHistoryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7f8c8d',
    marginTop: 15,
  },
  noHistorySubtext: {
    fontSize: 14,
    color: '#bdc3c7',
    marginTop: 5,
    textAlign: 'center',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  historyInfo: {
    flex: 1,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  historyDetails: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  historyTime: {
    fontSize: 12,
    color: '#95a5a6',
    marginTop: 2,
  },
  historyStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statBadge: {
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#27ae60',
  },
});

export default AttendanceScreen;