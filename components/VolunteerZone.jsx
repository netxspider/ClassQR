import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const VolunteerZone = () => {
  const volunteerActivities = [
    {
      id: 1,
      title: "Community Cleaning Drive",
      date: "15th October 2025",
      time: "8:00 AM - 12:00 PM",
      location: "Purnia City Center",
      volunteers: 25,
      status: "upcoming",
      icon: "leaf"
    },
    {
      id: 2,
      title: "Blood Donation Camp",
      date: "22nd October 2025",
      time: "9:00 AM - 4:00 PM",
      location: "VVIT Campus",
      volunteers: 15,
      status: "upcoming",
      icon: "heart"
    },
    {
      id: 3,
      title: "Digital Literacy Program",
      date: "5th October 2025",
      time: "2:00 PM - 6:00 PM",
      location: "Village School",
      volunteers: 12,
      status: "completed",
      icon: "laptop"
    }
  ];

  const quickActions = [
    { title: "Register for Activity", icon: "add-circle", color: "#27ae60" },
    { title: "View Schedule", icon: "calendar", color: "#3498db" },
    { title: "Report Hours", icon: "time", color: "#e67e22" },
    { title: "Submit Feedback", icon: "chatbubble", color: "#9b59b6" }
  ];

  const achievements = [
    { title: "Community Hero", hours: 120, icon: "star", color: "#f39c12" },
    { title: "Regular Volunteer", hours: 80, icon: "medal", color: "#e74c3c" },
    { title: "Event Organizer", hours: 60, icon: "ribbon", color: "#8e44ad" }
  ];

  const ActivityCard = ({ activity }) => (
    <View style={[styles.activityCard, { borderLeftColor: activity.status === 'upcoming' ? '#27ae60' : '#95a5a6' }]}>
      <View style={styles.activityHeader}>
        <View style={styles.activityIcon}>
          <Ionicons name={activity.icon} size={24} color={activity.status === 'upcoming' ? '#27ae60' : '#95a5a6'} />
        </View>
        <View style={styles.activityInfo}>
          <Text style={styles.activityTitle}>{activity.title}</Text>
          <Text style={styles.activityDate}>{activity.date}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: activity.status === 'upcoming' ? '#27ae60' : '#95a5a6' }]}>
          <Text style={styles.statusText}>{activity.status.toUpperCase()}</Text>
        </View>
      </View>
      
      <View style={styles.activityDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="time" size={16} color="#7f8c8d" />
          <Text style={styles.detailText}>{activity.time}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="location" size={16} color="#7f8c8d" />
          <Text style={styles.detailText}>{activity.location}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="people" size={16} color="#7f8c8d" />
          <Text style={styles.detailText}>{activity.volunteers} volunteers</Text>
        </View>
      </View>
      
      {activity.status === 'upcoming' && (
        <TouchableOpacity style={styles.joinButton}>
          <Text style={styles.joinButtonText}>Join Activity</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Volunteer Zone</Text>
        <Text style={styles.headerSubtitle}>Your NSS Activity Hub</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity key={index} style={[styles.quickActionCard, { borderTopColor: action.color }]}>
              <Ionicons name={action.icon} size={30} color={action.color} />
              <Text style={styles.quickActionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Your Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Volunteer Stats</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>45</Text>
            <Text style={styles.statLabel}>Hours Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Activities Joined</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Events Organized</Text>
          </View>
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Achievements</Text>
        <View style={styles.achievementsContainer}>
          {achievements.map((achievement, index) => (
            <View key={index} style={styles.achievementCard}>
              <Ionicons name={achievement.icon} size={32} color={achievement.color} />
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementHours}>{achievement.hours}+ hours</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Activities */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming & Recent Activities</Text>
        {volunteerActivities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Ready to make a difference?</Text>
        <TouchableOpacity style={styles.exploreButton}>
          <Text style={styles.exploreButtonText}>Explore More Activities</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#2c3e50',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#bdc3c7',
  },
  section: {
    margin: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: (width - 45) / 2,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 10,
    borderTopWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
    marginTop: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  achievementsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  achievementInfo: {
    marginLeft: 15,
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  achievementHours: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  activityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderLeftWidth: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  activityIcon: {
    marginRight: 15,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  activityDate: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  activityDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#2c3e50',
    marginLeft: 8,
  },
  joinButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    backgroundColor: '#2c3e50',
    padding: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  exploreButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  exploreButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default VolunteerZone;