import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = () => {
  const { user, userRole, userSection, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Coming Soon', 'Profile editing feature will be available soon!');
  };

  const handleChangePassword = () => {
    Alert.alert('Coming Soon', 'Password change feature will be available soon!');
  };

  const handleSettings = () => {
    Alert.alert('Coming Soon', 'Settings will be available soon!');
  };

  const handleHelp = () => {
    Alert.alert(
      'Help & Support',
      'For technical support, please contact:\n\nEmail: support@classqr.app\nPhone: +1 (555) 123-4567',
      [{ text: 'OK' }]
    );
  };

  const ProfileItem = ({ icon, title, subtitle, onPress, showArrow = true, color = '#2c3e50' }) => (
    <TouchableOpacity style={styles.profileItem} onPress={onPress}>
      <View style={styles.profileItemLeft}>
        <Ionicons name={icon} size={24} color={color} />
        <View style={styles.profileItemText}>
          <Text style={styles.profileItemTitle}>{title}</Text>
          {subtitle && <Text style={styles.profileItemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {showArrow && <Ionicons name="chevron-forward" size={20} color="#bdc3c7" />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image 
              source={require('../assets/ClassQR-logo.png')} 
              style={styles.avatar}
              resizeMode="contain"
            />
            <View style={[
              styles.roleBadge, 
              userRole === 'teacher' ? styles.teacherBadge : styles.studentBadge
            ]}>
              <Ionicons 
                name={userRole === 'teacher' ? 'school' : 'person'} 
                size={12} 
                color="white" 
              />
            </View>
          </View>
          
          <Text style={styles.userName}>
            {user?.email?.split('@')[0] || 'User'}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <Text style={styles.userRole}>
            {userRole === 'teacher' ? 'Teacher' : 'Student'} • {userSection}
          </Text>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <ProfileItem
            icon="person-outline"
            title="Edit Profile"
            subtitle="Update your personal information"
            onPress={handleEditProfile}
          />
          
          <ProfileItem
            icon="lock-closed-outline"
            title="Change Password"
            subtitle="Update your password"
            onPress={handleChangePassword}
          />
          
          <ProfileItem
            icon="notifications-outline"
            title="Notifications"
            subtitle="Manage notification preferences"
            onPress={handleSettings}
          />
        </View>

        {/* App Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App</Text>
          
          <ProfileItem
            icon="settings-outline"
            title="Settings"
            subtitle="App preferences and configuration"
            onPress={handleSettings}
          />
          
          <ProfileItem
            icon="help-circle-outline"
            title="Help & Support"
            subtitle="Get help and contact support"
            onPress={handleHelp}
          />
          
          <ProfileItem
            icon="information-circle-outline"
            title="About ClassQR"
            subtitle="Version 1.0.0"
            onPress={() => Alert.alert('About', 'ClassQR v1.0.0\nAttendance Management System')}
          />
        </View>

        {/* Stats Section (Role-specific) */}
        {userRole === 'teacher' ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Teaching Stats</Text>
            
            <ProfileItem
              icon="people-outline"
              title="Total Students"
              subtitle="Students in your section"
              onPress={() => {}}
              showArrow={false}
            />
            
            <ProfileItem
              icon="calendar-outline"
              title="Classes Conducted"
              subtitle="This semester"
              onPress={() => {}}
              showArrow={false}
            />
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Attendance Stats</Text>
            
            <ProfileItem
              icon="checkmark-circle-outline"
              title="Attendance Rate"
              subtitle="Overall attendance percentage"
              onPress={() => {}}
              showArrow={false}
            />
            
            <ProfileItem
              icon="calendar-outline"
              title="Classes Attended"
              subtitle="This semester"
              onPress={() => {}}
              showArrow={false}
            />
          </View>
        )}

        {/* Logout Section */}
        <View style={styles.section}>
          <ProfileItem
            icon="log-out-outline"
            title="Logout"
            subtitle="Sign out of your account"
            onPress={handleLogout}
            color="#e74c3c"
            showArrow={false}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with ❤️ for ClassQR
          </Text>
          <Text style={styles.footerSubtext}>
            © 2024 ClassQR. All rights reserved.
          </Text>
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
    paddingVertical: 15,
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
  content: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ecf0f1',
  },
  roleBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  teacherBadge: {
    backgroundColor: '#27ae60',
  },
  studentBadge: {
    backgroundColor: '#3498db',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  userRole: {
    fontSize: 14,
    fontWeight: '600',
    color: '#95a5a6',
  },
  section: {
    backgroundColor: 'white',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  profileItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileItemText: {
    marginLeft: 15,
    flex: 1,
  },
  profileItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  profileItemSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  footerText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#bdc3c7',
  },
});

export default ProfileScreen;