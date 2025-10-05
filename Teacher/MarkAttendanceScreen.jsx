import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { qrService } from '../services/qrService';

const MarkAttendanceScreen = ({ route, navigation }) => {
  const { sessionId, section, teacherId } = route.params;
  const [scannedStudents, setScannedStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to real-time updates of scanned students
    const unsubscribe = qrService.listenToScannedStudents(sessionId, (students) => {
      setScannedStudents(students);
      setLoading(false);
    });

    return unsubscribe;
  }, [sessionId]);

  const handleFinalizeAttendance = async () => {
    try {
      Alert.alert(
        'Finalize Attendance',
        `Are you sure you want to finalize attendance? ${scannedStudents.length} students have scanned the QR code.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Finalize',
            onPress: async () => {
              setLoading(true);
              try {
                await qrService.finalizeAttendance(sessionId, section, teacherId);
                Alert.alert(
                  'Success',
                  'Attendance has been finalized successfully!',
                  [{ text: 'OK', onPress: () => navigation.goBack() }]
                );
              } catch (error) {
                console.error('Error finalizing attendance:', error);
                Alert.alert('Error', 'Failed to finalize attendance');
                setLoading(false);
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error in finalize attendance:', error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const renderStudentItem = ({ item, index }) => {
    const locationVerification = item.locationVerification;
    const hasLocationVerification = locationVerification && locationVerification.distance !== null;
    
    return (
      <View style={styles.studentItem}>
        <View style={styles.studentInfo}>
          <View style={styles.studentHeader}>
            <Text style={styles.studentName}>
              {item.name || item.email?.split('@')[0] || 'Unknown Student'}
            </Text>
            <View style={styles.statusContainer}>
              <View style={styles.presentBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#27ae60" />
                <Text style={styles.presentText}>Present</Text>
              </View>
              {hasLocationVerification && (
                <View style={[
                  styles.locationBadge,
                  locationVerification.verified ? styles.locationVerified : styles.locationUnverified
                ]}>
                  <Ionicons 
                    name={locationVerification.verified ? "location" : "warning"} 
                    size={12} 
                    color={locationVerification.verified ? "#27ae60" : "#e74c3c"} 
                  />
                  <Text style={[
                    styles.locationText,
                    locationVerification.verified ? styles.locationTextVerified : styles.locationTextUnverified
                  ]}>
                    {locationVerification.distance}m
                  </Text>
                </View>
              )}
            </View>
          </View>
          <Text style={styles.studentEmail}>{item.email}</Text>
          <View style={styles.statusRow}>
            <Text style={styles.scanTime}>
              Scanned: {new Date(item.scannedAt).toLocaleTimeString()}
            </Text>
            {hasLocationVerification && (
              <Text style={[
                styles.locationStatus,
                locationVerification.verified ? styles.locationStatusVerified : styles.locationStatusUnverified
              ]}>
                {locationVerification.reason}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.orderBadge}>
          <Text style={styles.orderText}>#{index + 1}</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#27ae60" />
          <Text style={styles.loadingText}>Loading attendance data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.title}>Mark Attendance</Text>
          <Text style={styles.subtitle}>Section {section}</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{scannedStudents.length}</Text>
          <Text style={styles.statLabel}>Students Scanned</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, styles.successNumber]}>
            {scannedStudents.length}
          </Text>
          <Text style={styles.statLabel}>Present</Text>
        </View>
      </View>

      <View style={styles.content}>
        {scannedStudents.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="qr-code-outline" size={80} color="#bdc3c7" />
            <Text style={styles.emptyTitle}>Waiting for students to scan...</Text>
            <Text style={styles.emptySubtitle}>
              Students who scan the QR code will appear here in real-time
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>Scanned Students</Text>
              <Text style={styles.listSubtitle}>
                In order of scanning
              </Text>
            </View>
            <FlatList
              data={scannedStudents}
              renderItem={renderStudentItem}
              keyExtractor={(item, index) => `${item.id || item.email}-${index}`}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          </>
        )}
      </View>

      {scannedStudents.length > 0 && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.finalizeButton}
            onPress={handleFinalizeAttendance}
          >
            <Ionicons name="checkmark-done" size={20} color="white" />
            <Text style={styles.finalizeButtonText}>
              Finalize Attendance ({scannedStudents.length})
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerInfo: {
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  placeholder: {
    width: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingTop: 15,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  successNumber: {
    color: '#27ae60',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 5,
  },
  content: {
    flex: 1,
    margin: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 20,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 20,
  },
  listHeader: {
    marginBottom: 15,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  listSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  listContainer: {
    paddingBottom: 20,
  },
  studentItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  studentInfo: {
    flex: 1,
  },
  studentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  presentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d5f4e6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  presentText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#27ae60',
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 3,
  },
  locationVerified: {
    backgroundColor: '#e8f5e8',
  },
  locationUnverified: {
    backgroundColor: '#fdeaea',
  },
  locationText: {
    fontSize: 10,
    fontWeight: '600',
  },
  locationTextVerified: {
    color: '#27ae60',
  },
  locationTextUnverified: {
    color: '#e74c3c',
  },
  studentEmail: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  scanTime: {
    fontSize: 12,
    color: '#95a5a6',
  },
  locationStatus: {
    fontSize: 11,
    fontWeight: '500',
  },
  locationStatusVerified: {
    color: '#27ae60',
  },
  locationStatusUnverified: {
    color: '#e74c3c',
  },
  orderBadge: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  orderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498db',
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  finalizeButton: {
    backgroundColor: '#27ae60',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    gap: 8,
  },
  finalizeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MarkAttendanceScreen;