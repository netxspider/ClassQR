import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { teacherService } from '../services/teacherService';
import { createMockStudents } from '../utils/mockData';

const TDashboard = () => {
  const { user, userSection, logout } = useAuth();
  const [students, setStudents] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [attendanceLoading, setAttendanceLoading] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Get today's date in readable format
  const getTodayDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load students in the same section
      const studentsData = await teacherService.getStudentsBySection(userSection);
      setStudents(studentsData);
      
      // Load today's attendance
      const attendance = await teacherService.getTodayAttendance(userSection);
      setTodayAttendance(attendance);
      
    } catch (error) {
      console.error('Error loading dashboard:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Refresh data
  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  // Initialize attendance for today
  const initializeTodayAttendance = async () => {
    try {
      setAttendanceLoading(true);
      const attendanceData = await teacherService.createTodayAttendance(userSection, students);
      setTodayAttendance(attendanceData);
      Alert.alert('Success', 'Today\'s attendance sheet has been created!');
    } catch (error) {
      console.error('Error initializing attendance:', error);
      Alert.alert('Error', 'Failed to create attendance sheet');
    } finally {
      setAttendanceLoading(false);
    }
  };

  // Create mock students for testing (remove in production)
  const handleCreateMockStudents = async () => {
    try {
      Alert.alert(
        'Create Test Students',
        'This will create 5 mock students for testing. Continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Create',
            onPress: async () => {
              setLoading(true);
              await createMockStudents(userSection);
              await loadDashboardData();
              Alert.alert('Success', '5 mock students have been created!');
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error creating mock students:', error);
      Alert.alert('Error', 'Failed to create mock students');
    }
  };

  useEffect(() => {
    if (userSection) {
      loadDashboardData();
    }
  }, [userSection]);

  // Render student attendance item
  const renderAttendanceItem = ({ item }) => (
    <View style={styles.attendanceItem}>
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>
          {item.name || item.email?.split('@')[0] || 'Unknown'}
        </Text>
        <Text style={styles.studentRoll}>Roll No: {item.rollNo || 'N/A'}</Text>
      </View>
      <View style={[
        styles.statusBadge, 
        item.status === 'present' ? styles.presentBadge : styles.absentBadge
      ]}>
        <Text style={[
          styles.statusText,
          item.status === 'present' ? styles.presentText : styles.absentText
        ]}>
          {item.status === 'present' ? 'Present' : 'Absent'}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#27ae60" />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Teacher Dashboard</Text>
          <Text style={styles.dateText}>{getTodayDate()}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#e74c3c" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome, {user?.email?.split('@')[0]}!</Text>
          <Text style={styles.sectionText}>Department: {userSection}</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="people" size={30} color="#3498db" />
            <Text style={styles.statNumber}>{students.length}</Text>
            <Text style={styles.statLabel}>Total Students</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="calendar" size={30} color="#27ae60" />
            <Text style={styles.statNumber}>
              {todayAttendance ? todayAttendance.presentCount : 0}
            </Text>
            <Text style={styles.statLabel}>Present Today</Text>
          </View>
        </View>

        {/* Today's Attendance Section */}
        <View style={styles.attendanceSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Attendance</Text>
            {!todayAttendance ? (
              <TouchableOpacity 
                style={styles.initButton}
                onPress={initializeTodayAttendance}
                disabled={attendanceLoading}
              >
                {attendanceLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Ionicons name="add" size={16} color="white" />
                    <Text style={styles.initButtonText}>Start</Text>
                  </>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.qrButton}>
                <Ionicons name="qr-code" size={16} color="white" />
                <Text style={styles.qrButtonText}>QR Code</Text>
              </TouchableOpacity>
            )}
          </View>

          {!todayAttendance ? (
            <View style={styles.noAttendanceContainer}>
              <Ionicons name="clipboard-outline" size={50} color="#bdc3c7" />
              <Text style={styles.noAttendanceText}>Attendance not started yet</Text>
              <Text style={styles.noAttendanceSubtext}>
                Tap "Start" to initialize today's attendance
              </Text>
            </View>
          ) : (
            <FlatList
              data={todayAttendance.students}
              renderItem={renderAttendanceItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyList}>
                  <Text style={styles.emptyListText}>No students found</Text>
                </View>
              }
            />
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity style={styles.actionCard} onPress={handleCreateMockStudents}>
            <Ionicons name="person-add" size={24} color="#3498db" />
            <Text style={styles.actionText}>Add Mock Students (Test)</Text>
            <Ionicons name="chevron-forward" size={20} color="#bdc3c7" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="stats-chart" size={24} color="#27ae60" />
            <Text style={styles.actionText}>View Reports</Text>
            <Ionicons name="chevron-forward" size={20} color="#bdc3c7" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="settings" size={24} color="#f39c12" />
            <Text style={styles.actionText}>Settings</Text>
            <Ionicons name="chevron-forward" size={20} color="#bdc3c7" />
          </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
  logoutButton: {
    padding: 5,
  },
  content: {
    flex: 1,
  },
  welcomeSection: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  sectionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#27ae60',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    gap: 15,
    marginBottom: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
    textAlign: 'center',
  },
  attendanceSection: {
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  initButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27ae60',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 5,
  },
  initButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 5,
  },
  qrButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  noAttendanceContainer: {
    alignItems: 'center',
    padding: 40,
  },
  noAttendanceText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7f8c8d',
    marginTop: 15,
  },
  noAttendanceSubtext: {
    fontSize: 14,
    color: '#bdc3c7',
    marginTop: 5,
    textAlign: 'center',
  },
  attendanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  studentRoll: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    minWidth: 70,
    alignItems: 'center',
  },
  presentBadge: {
    backgroundColor: '#d5f4e6',
  },
  absentBadge: {
    backgroundColor: '#fdeaea',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  presentText: {
    color: '#27ae60',
  },
  absentText: {
    color: '#e74c3c',
  },
  emptyList: {
    padding: 20,
    alignItems: 'center',
  },
  emptyListText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  actionsSection: {
    margin: 15,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginLeft: 15,
  },
});

export default TDashboard;