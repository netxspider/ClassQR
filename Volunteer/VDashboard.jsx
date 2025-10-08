import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator,
  RefreshControl,
  Alert,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { volunteerService } from '../services/volunteerService';

const { width } = Dimensions.get('window');

const VDashboard = () => {
  const { user, userSection, logout } = useAuth();
  const [volunteerStats, setVolunteerStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  // Sample data for volunteer activities
  const sampleStats = {
    totalActivities: 24,
    attendedActivities: 20,
    serviceHours: 120,
    attendancePercentage: 83.3,
    currentStreak: 5,
    achievements: 8,
    upcomingEvents: 3,
    pendingTasks: 2
  };

  const sampleRecentActivities = [
    {
      id: 1,
      title: "Blood Donation Camp",
      date: "2024-01-15",
      status: "Attended",
      hours: 6,
      location: "VVIT Campus"
    },
    {
      id: 2,
      title: "Digital Literacy Training",
      date: "2024-01-12",
      status: "Attended", 
      hours: 4,
      location: "Community Center"
    },
    {
      id: 3,
      title: "Tree Plantation Drive",
      date: "2024-01-10",
      status: "Attended",
      hours: 3,
      location: "Eco Park"
    },
    {
      id: 4,
      title: "Health Awareness Camp",
      date: "2024-01-08",
      status: "Missed",
      hours: 0,
      location: "Rural Village"
    }
  ];

  const sampleUpcomingEvents = [
    {
      id: 1,
      title: "Cleanliness Drive",
      date: "2024-01-20",
      time: "08:00 AM",
      location: "City Market Area",
      participants: 45
    },
    {
      id: 2,
      title: "Educational Workshop",
      date: "2024-01-22",
      time: "10:00 AM", 
      location: "Government School",
      participants: 30
    },
    {
      id: 3,
      title: "Senior Citizen Care",
      date: "2024-01-25",
      time: "02:00 PM",
      location: "Old Age Home",
      participants: 20
    }
  ];

  useEffect(() => {
    fetchVolunteerData();
  }, []);

  const fetchVolunteerData = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setVolunteerStats(sampleStats);
      setRecentActivities(sampleRecentActivities);
      setUpcomingEvents(sampleUpcomingEvents);
    } catch (error) {
      console.error('Error fetching volunteer data:', error);
      Alert.alert('Error', 'Failed to load volunteer data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchVolunteerData();
    setRefreshing(false);
  };

  const StatCard = ({ title, value, subtitle, icon, color = '#3498db' }) => (
    <View style={[styles.statCard, { borderTopColor: color }]}>
      <View style={styles.statHeader}>
        <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={20} color={color} />
        </View>
        <View style={styles.statInfo}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
          {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
        </View>
      </View>
    </View>
  );

  const ActivityCard = ({ activity }) => (
    <View style={styles.activityCard}>
      <View style={styles.activityHeader}>
        <View style={styles.activityInfo}>
          <Text style={styles.activityTitle}>{activity.title}</Text>
          <Text style={styles.activityLocation}>
            <Ionicons name="location" size={12} color="#7f8c8d" /> {activity.location}
          </Text>
        </View>
        <View style={[
          styles.statusBadge, 
          { backgroundColor: activity.status === 'Attended' ? '#27ae60' : '#e74c3c' }
        ]}>
          <Text style={styles.statusText}>{activity.status}</Text>
        </View>
      </View>
      
      <View style={styles.activityFooter}>
        <Text style={styles.activityDate}>
          <Ionicons name="calendar" size={12} color="#7f8c8d" /> 
          {new Date(activity.date).toLocaleDateString()}
        </Text>
        <Text style={styles.activityHours}>
          <Ionicons name="time" size={12} color="#7f8c8d" /> 
          {activity.hours} hours
        </Text>
      </View>
    </View>
  );

  const EventCard = ({ event }) => (
    <View style={styles.eventCard}>
      <View style={styles.eventHeader}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <View style={styles.participantsBadge}>
          <Ionicons name="people" size={12} color="#3498db" />
          <Text style={styles.participantsText}>{event.participants}</Text>
        </View>
      </View>
      
      <Text style={styles.eventLocation}>
        <Ionicons name="location" size={12} color="#7f8c8d" /> {event.location}
      </Text>
      
      <View style={styles.eventFooter}>
        <Text style={styles.eventDate}>
          <Ionicons name="calendar" size={12} color="#27ae60" /> 
          {new Date(event.date).toLocaleDateString()}
        </Text>
        <Text style={styles.eventTime}>
          <Ionicons name="time" size={12} color="#f39c12" /> 
          {event.time}
        </Text>
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading volunteer data...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3498db']}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.userName}>{user?.displayName || 'Volunteer'}</Text>
              <Text style={styles.sectionText}>NSS Unit - {userSection || 'General'}</Text>
            </View>
            <TouchableOpacity style={styles.profileButton}>
              <Ionicons name="person-circle" size={40} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <StatCard 
              title="Activities"
              value={volunteerStats?.attendedActivities || 0}
              subtitle={`of ${volunteerStats?.totalActivities || 0} total`}
              icon="checkmark-circle"
              color="#27ae60"
            />
            <StatCard 
              title="Service Hours"
              value={volunteerStats?.serviceHours || 0}
              subtitle="Total hours"
              icon="time"
              color="#3498db"
            />
          </View>
          
          <View style={styles.statsRow}>
            <StatCard 
              title="Attendance"
              value={`${volunteerStats?.attendancePercentage || 0}%`}
              subtitle="This semester"
              icon="analytics"
              color="#9b59b6"
            />
            <StatCard 
              title="Achievements"
              value={volunteerStats?.achievements || 0}
              subtitle="Badges earned"
              icon="trophy"
              color="#f39c12"
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity style={[styles.quickActionButton, { backgroundColor: '#27ae60' }]}>
              <Ionicons name="qr-code" size={24} color="#ffffff" />
              <Text style={styles.quickActionText}>Scan QR</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.quickActionButton, { backgroundColor: '#3498db' }]}>
              <Ionicons name="calendar" size={24} color="#ffffff" />
              <Text style={styles.quickActionText}>View Events</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.quickActionButton, { backgroundColor: '#e74c3c' }]}>
              <Ionicons name="document-text" size={24} color="#ffffff" />
              <Text style={styles.quickActionText}>Reports</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.quickActionButton, { backgroundColor: '#9b59b6' }]}>
              <Ionicons name="people" size={24} color="#ffffff" />
              <Text style={styles.quickActionText}>Team</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activities */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activities</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {recentActivities.slice(0, 3).map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </View>

        {/* Upcoming Events */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </View>

        {/* Performance Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Insights</Text>
          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <Ionicons name="trending-up" size={24} color="#27ae60" />
              <Text style={styles.insightTitle}>Great Progress!</Text>
            </View>
            <Text style={styles.insightText}>
              You've maintained a {volunteerStats?.currentStreak || 0}-activity streak. 
              Keep up the excellent work in community service!
            </Text>
            <View style={styles.insightFooter}>
              <Text style={styles.insightMetric}>
                {volunteerStats?.attendancePercentage || 0}% attendance rate this month
              </Text>
            </View>
          </View>
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
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7f8c8d',
  },
  header: {
    backgroundColor: '#2c3e50',
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: '#bdc3c7',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginVertical: 2,
  },
  sectionText: {
    fontSize: 14,
    color: '#ecf0f1',
  },
  profileButton: {
    padding: 5,
  },
  statsContainer: {
    paddingHorizontal: 15,
    marginTop: -15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    width: (width - 45) / 2,
    borderTopWidth: 3,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    padding: 8,
    borderRadius: 10,
    marginRight: 12,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statTitle: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
  statSubtitle: {
    fontSize: 10,
    color: '#95a5a6',
  },
  section: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  viewAllText: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '600',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: (width - 75) / 4,
    height: 70,
    borderRadius: 12,
  },
  quickActionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
  },
  activityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  activityInfo: {
    flex: 1,
    marginRight: 10,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  activityLocation: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 10,
  },
  activityDate: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  activityHours: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  eventCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#27ae60',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
    marginRight: 10,
  },
  participantsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  participantsText: {
    fontSize: 10,
    color: '#3498db',
    fontWeight: 'bold',
    marginLeft: 3,
  },
  eventLocation: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eventDate: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  eventTime: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  insightCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    borderTopWidth: 3,
    borderTopColor: '#27ae60',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 10,
  },
  insightText: {
    fontSize: 14,
    color: '#2c3e50',
    lineHeight: 20,
    marginBottom: 15,
  },
  insightFooter: {
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 15,
  },
  insightMetric: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#27ae60',
  },
});

export default VDashboard;