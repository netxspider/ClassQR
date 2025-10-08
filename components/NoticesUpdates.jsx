import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NoticesUpdates = () => {
  const notices = [
    {
      id: 1,
      title: "NSS Day Celebration 2024",
      type: "event",
      priority: "high",
      date: "2024-09-24",
      content: "Join us for the NSS Day celebration on September 24th. Various cultural programs and volunteer recognition ceremonies will be held.",
      author: "NSS Program Office"
    },
    {
      id: 2,
      title: "Blood Donation Camp Registration Open",
      type: "registration",
      priority: "medium",
      date: "2024-10-15",
      content: "Registration for the upcoming blood donation camp is now open. Volunteers can register through the NSS portal.",
      author: "Health Committee"
    },
    {
      id: 3,
      title: "New Guidelines for Community Projects",
      type: "guideline",
      priority: "high",
      date: "2024-10-10",
      content: "Updated guidelines for community project implementation have been released. All volunteers must review the new procedures.",
      author: "NSS Coordinator"
    },
    {
      id: 4,
      title: "Winter Camp Applications Due",
      type: "deadline",
      priority: "urgent",
      date: "2024-10-20",
      content: "Applications for the winter special camp must be submitted by October 20th. Late submissions will not be accepted.",
      author: "Camp Coordinator"
    }
  ];

  const updates = [
    {
      id: 1,
      title: "Mobile App Update 1.2.0 Released",
      date: "2024-10-08",
      content: "New features include QR code scanning improvements and enhanced volunteer dashboard.",
      type: "app_update"
    },
    {
      id: 2,
      title: "NSS Website Maintenance",
      date: "2024-10-05",
      content: "The NSS portal will be under maintenance on October 12th from 2 AM to 6 AM.",
      type: "maintenance"
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return '#e74c3c';
      case 'high': return '#f39c12';
      case 'medium': return '#3498db';
      default: return '#95a5a6';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'event': return 'calendar';
      case 'registration': return 'person-add';
      case 'guideline': return 'document-text';
      case 'deadline': return 'time';
      case 'app_update': return 'phone-portrait';
      case 'maintenance': return 'construct';
      default: return 'information-circle';
    }
  };

  const NoticeCard = ({ notice }) => (
    <TouchableOpacity style={styles.noticeCard}>
      <View style={styles.noticeHeader}>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(notice.priority) }]}>
          <Text style={styles.priorityText}>{notice.priority?.toUpperCase()}</Text>
        </View>
        <Text style={styles.noticeDate}>{new Date(notice.date).toLocaleDateString()}</Text>
      </View>
      
      <View style={styles.noticeContent}>
        <View style={styles.noticeTitleRow}>
          <Ionicons name={getTypeIcon(notice.type)} size={20} color="#3498db" />
          <Text style={styles.noticeTitle}>{notice.title}</Text>
        </View>
        
        <Text style={styles.noticeText}>{notice.content}</Text>
        
        <View style={styles.noticeFooter}>
          <Text style={styles.noticeAuthor}>— {notice.author}</Text>
          <TouchableOpacity style={styles.readMoreButton}>
            <Text style={styles.readMoreText}>Read More</Text>
            <Ionicons name="chevron-forward" size={14} color="#3498db" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const UpdateCard = ({ update }) => (
    <View style={styles.updateCard}>
      <View style={styles.updateHeader}>
        <Ionicons name={getTypeIcon(update.type)} size={18} color="#27ae60" />
        <View style={styles.updateInfo}>
          <Text style={styles.updateTitle}>{update.title}</Text>
          <Text style={styles.updateDate}>{new Date(update.date).toLocaleDateString()}</Text>
        </View>
      </View>
      <Text style={styles.updateContent}>{update.content}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="notifications" size={40} color="#ffffff" />
        <Text style={styles.headerTitle}>Notices & Updates</Text>
        <Text style={styles.headerSubtitle}>Stay informed with latest news</Text>
      </View>

      {/* Important Notices */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="megaphone" size={20} color="#e74c3c" />
          <Text style={styles.sectionTitle}>Important Notices</Text>
        </View>
        
        {notices.map((notice) => (
          <NoticeCard key={notice.id} notice={notice} />
        ))}
      </View>

      {/* Recent Updates */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="refresh" size={20} color="#27ae60" />
          <Text style={styles.sectionTitle}>Recent Updates</Text>
        </View>
        
        {updates.map((update) => (
          <UpdateCard key={update.id} update={update} />
        ))}
      </View>

      {/* Subscription Section */}
      <View style={styles.subscriptionSection}>
        <View style={styles.subscriptionHeader}>
          <Ionicons name="mail" size={32} color="#3498db" />
          <Text style={styles.subscriptionTitle}>Stay Updated</Text>
        </View>
        <Text style={styles.subscriptionText}>
          Enable notifications to receive important notices and updates instantly on your device.
        </Text>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications" size={16} color="#ffffff" />
          <Text style={styles.notificationButtonText}>Enable Notifications</Text>
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
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 10,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#bdc3c7',
  },
  section: {
    margin: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 10,
  },
  noticeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  noticeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingBottom: 0,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  noticeDate: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  noticeContent: {
    padding: 15,
  },
  noticeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 10,
    flex: 1,
  },
  noticeText: {
    fontSize: 14,
    color: '#2c3e50',
    lineHeight: 20,
    marginBottom: 15,
  },
  noticeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noticeAuthor: {
    fontSize: 12,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    fontSize: 12,
    color: '#3498db',
    fontWeight: 'bold',
    marginRight: 3,
  },
  updateCard: {
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
  updateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  updateInfo: {
    marginLeft: 10,
    flex: 1,
  },
  updateTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  updateDate: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
  updateContent: {
    fontSize: 13,
    color: '#2c3e50',
    lineHeight: 18,
  },
  subscriptionSection: {
    backgroundColor: '#ffffff',
    margin: 15,
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  subscriptionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 10,
  },
  subscriptionText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  notificationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  notificationButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default NoticesUpdates;