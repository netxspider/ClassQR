import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RoleSelection = ({ onSelectRole }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('../assets/ClassQR-logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Welcome to ClassQR</Text>
        <Text style={styles.subtitle}>Choose your role to continue</Text>
      </View>

      <View style={styles.rolesContainer}>
        <TouchableOpacity 
          style={styles.roleCard}
          onPress={() => onSelectRole('student')}
        >
          <View style={styles.roleIconContainer}>
            <Ionicons name="school-outline" size={60} color="#3498db" />
          </View>
          <Text style={styles.roleTitle}>Student</Text>
          <Text style={styles.roleDescription}>
            Join classes, scan QR codes, and track your attendance
          </Text>
          <View style={styles.roleButton}>
            <Text style={styles.roleButtonText}>Continue as Student</Text>
            <Ionicons name="arrow-forward" size={20} color="#3498db" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.roleCard}
          onPress={() => onSelectRole('teacher')}
        >
          <View style={styles.roleIconContainer}>
            <Ionicons name="person-outline" size={60} color="#27ae60" />
          </View>
          <Text style={styles.roleTitle}>Teacher</Text>
          <Text style={styles.roleDescription}>
            Create classes, generate QR codes, and manage attendance
          </Text>
          <View style={styles.roleButton}>
            <Text style={styles.roleButtonText}>Continue as Teacher</Text>
            <Ionicons name="arrow-forward" size={20} color="#27ae60" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  rolesContainer: {
    gap: 20,
  },
  roleCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  roleIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  roleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  roleDescription: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 25,
  },
  roleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3498db',
  },
});

export default RoleSelection;