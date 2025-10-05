import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { studentService } from '../services/studentService';

const SDashboard = () => {
  const { user, userSection, logout } = useAuth();
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load attendance data
  const loadAttendanceData = async () => {
    try {
      setLoading(true);
      const stats = await studentService.getMonthlyAttendanceStats(user.uid, userSection);
      setAttendanceStats(stats);
    } catch (error) {
      console.error('Error loading attendance data:', error);
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
    if (user && userSection) {
      loadAttendanceData();
    }
  }, [user, userSection]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Get attendance percentage color
  const getAttendanceColor = (percentage) => {
    if (percentage >= 85) return '#27ae60';
    if (percentage >= 70) return '#f39c12';
    return '#e74c3c';
  };

  // Get attendance status
  const getAttendanceStatus = (percentage) => {
    if (percentage >= 85) return 'Excellent';
    if (percentage >= 70) return 'Good';
    return 'Needs Improvement';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Student Dashboard</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="#e74c3c" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Loading attendance data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Student Dashboard</Text>
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
          <Text style={styles.welcomeText}>
            Welcome, {user?.displayName || user?.email?.split('@')[0] || 'Student'}!
          </Text>
          <Text style={styles.sectionText}>Section: {userSection}</Text>
        </View>

        {attendanceStats && (
          <>
            {/* Monthly Overview */}
            <View style={styles.overviewCard}>
              <Text style={styles.cardTitle}>📊 {attendanceStats.currentMonth} Overview</Text>
              
              <View style={styles.statsContainer}>
                <View style={styles.mainStat}>
                  <Text style={[styles.percentageText, { color: getAttendanceColor(attendanceStats.attendancePercentage) }]}>
                    {attendanceStats.attendancePercentage}%
                  </Text>
                  <Text style={styles.statusText}>
                    {getAttendanceStatus(attendanceStats.attendancePercentage)}
                  </Text>
                </View>
                
                <View style={styles.detailStats}>
                  <View style={styles.statItem}>
                    <Ionicons name="checkmark-circle" size={20} color="#27ae60" />
                    <Text style={styles.statLabel}>Present</Text>
                    <Text style={styles.statValue}>{attendanceStats.totalDaysPresent} days</Text>
                  </View>
                  
                  <View style={styles.statItem}>
                    <Ionicons name="close-circle" size={20} color="#e74c3c" />
                    <Text style={styles.statLabel}>Absent</Text>
                    <Text style={styles.statValue}>{attendanceStats.daysAbsent} days</Text>
                  </View>
                  
                  <View style={styles.statItem}>
                    <Ionicons name="calendar" size={20} color="#3498db" />
                    <Text style={styles.statLabel}>Total Days</Text>
                    <Text style={styles.statValue}>{attendanceStats.totalWorkingDays} days</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Recent Activity */}
            <View style={styles.activityCard}>
              <Text style={styles.cardTitle}>📅 Recent Activity</Text>
              <View style={styles.activityStats}>
                <View style={styles.activityItem}>
                  <Ionicons name="time" size={24} color="#f39c12" />
                  <Text style={styles.activityValue}>{attendanceStats.recentAttendance}</Text>
                  <Text style={styles.activityLabel}>Last 7 days</Text>
                </View>
                <View style={styles.activityItem}>
                  <Ionicons name="location" size={24} color="#27ae60" />
                  <Text style={styles.activityValue}>{attendanceStats.locationStats.verified}</Text>
                  <Text style={styles.activityLabel}>Location verified</Text>
                </View>
              </View>
            </View>

            {/* Location Verification Stats */}
            {(attendanceStats.locationStats.verified > 0 || attendanceStats.locationStats.unverified > 0) && (
              <View style={styles.locationCard}>
                <Text style={styles.cardTitle}>📍 Location Verification</Text>
                <View style={styles.locationStats}>
                  <View style={styles.locationStat}>
                    <Ionicons name="checkmark-circle" size={16} color="#27ae60" />
                    <Text style={styles.locationLabel}>Verified</Text>
                    <Text style={[styles.locationValue, { color: '#27ae60' }]}>
                      {attendanceStats.locationStats.verified}
                    </Text>
                  </View>
                  
                  {attendanceStats.locationStats.unverified > 0 && (
                    <View style={styles.locationStat}>
                      <Ionicons name="warning" size={16} color="#e74c3c" />
                      <Text style={styles.locationLabel}>Unverified</Text>
                      <Text style={[styles.locationValue, { color: '#e74c3c' }]}>
                        {attendanceStats.locationStats.unverified}
                      </Text>
                    </View>
                  )}
                  
                  {attendanceStats.locationStats.noLocation > 0 && (
                    <View style={styles.locationStat}>
                      <Ionicons name="help-circle" size={16} color="#95a5a6" />
                      <Text style={styles.locationLabel}>No Location</Text>
                      <Text style={[styles.locationValue, { color: '#95a5a6' }]}>
                        {attendanceStats.locationStats.noLocation}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* Attendance Tips */}
            <View style={styles.tipsCard}>
              <Text style={styles.cardTitle}>💡 Attendance Tips</Text>
              {attendanceStats.attendancePercentage < 85 ? (
                <View style={styles.tipsList}>
                  <View style={styles.tipItem}>
                    <Ionicons name="alarm" size={16} color="#f39c12" />
                    <Text style={styles.tipText}>Arrive early to avoid missing QR codes</Text>
                  </View>
                  <View style={styles.tipItem}>
                    <Ionicons name="location" size={16} color="#3498db" />
                    <Text style={styles.tipText}>Enable location services for verification</Text>
                  </View>
                  <View style={styles.tipItem}>
                    <Ionicons name="calendar" size={16} color="#27ae60" />
                    <Text style={styles.tipText}>Maintain {85 - Math.floor(attendanceStats.attendancePercentage)}% more attendance this month</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.congratsMessage}>
                  <Ionicons name="trophy" size={24} color="#f1c40f" />
                  <Text style={styles.congratsText}>
                    Great job! Keep up the excellent attendance record.
                  </Text>
                </View>
              )}
            </View>
          </>
        )}

        {!attendanceStats && (
          <View style={styles.noDataCard}>
            <Ionicons name="calendar-outline" size={60} color="#bdc3c7" />
            <Text style={styles.noDataTitle}>No Attendance Data</Text>
            <Text style={styles.noDataText}>
              Your attendance records will appear here once you start marking attendance.
            </Text>
          </View>
        )}
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
  logoutButton: {
    padding: 5,
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
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  welcomeSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginVertical: 15,
    alignItems: 'center',
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
    textAlign: 'center',
  },
  sectionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3498db',
    textAlign: 'center',
  },
  overviewCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainStat: {
    flex: 1,
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
    marginTop: 5,
  },
  detailStats: {
    flex: 2,
    paddingLeft: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    flex: 1,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  activityItem: {
    alignItems: 'center',
  },
  activityValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 8,
  },
  activityLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
    textAlign: 'center',
  },
  locationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  locationStat: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  locationLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
    marginBottom: 2,
  },
  locationValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tipsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tipText: {
    fontSize: 14,
    color: '#7f8c8d',
    flex: 1,
    lineHeight: 20,
  },
  congratsMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff9e6',
    padding: 15,
    borderRadius: 8,
    gap: 12,
  },
  congratsText: {
    fontSize: 14,
    color: '#f39c12',
    fontWeight: '600',
    flex: 1,
    lineHeight: 20,
  },
  noDataCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 40,
    marginVertical: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noDataTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7f8c8d',
    marginTop: 15,
    marginBottom: 8,
  },
  noDataText: {
    fontSize: 14,
    color: '#bdc3c7',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default SDashboard;