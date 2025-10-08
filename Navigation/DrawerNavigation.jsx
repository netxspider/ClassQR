import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';

import BottomTabNavigation from './BottomTabNavigation';
import AboutScreen from '../components/AboutScreen';
import VolunteerZone from '../components/VolunteerZone';
import Resources from '../components/Resources';
import ELibrary from '../components/ELibrary';
import NoticesUpdates from '../components/NoticesUpdates';
import AchievementRecognition from '../components/AchievementRecognition';
import AboutDeveloper from '../components/AboutDeveloper';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Navigation will be handled by auth state listener
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <DrawerContentScrollView {...props} style={styles.drawerContainer}>
      {/* Header Section */}
      <View style={styles.drawerHeader}>
        <View style={styles.logoContainer}>
          <Ionicons name="school" size={40} color="#e74c3c" />
        </View>
        <Text style={styles.appTitle}>NSS VVIT</Text>
        <Text style={styles.appSubtitle}>ClassQR System</Text>
      </View>

      {/* Navigation Items */}
      <View style={styles.navigationSection}>
        <DrawerItem
          label="Home/Dashboard"
          icon={({ color, size }) => <Ionicons name="home" size={size} color={color} />}
          onPress={() => props.navigation.navigate('Home')}
          labelStyle={styles.drawerLabel}
          activeTintColor="#e74c3c"
          inactiveTintColor="#2c3e50"
        />
        
        <DrawerItem
          label="About NSS"
          icon={({ color, size }) => <Ionicons name="information-circle" size={size} color={color} />}
          onPress={() => props.navigation.navigate('About')}
          labelStyle={styles.drawerLabel}
          activeTintColor="#e74c3c"
          inactiveTintColor="#2c3e50"
        />
        
        <DrawerItem
          label="Volunteer Zone"
          icon={({ color, size }) => <Ionicons name="people" size={size} color={color} />}
          onPress={() => props.navigation.navigate('VolunteerZone')}
          labelStyle={styles.drawerLabel}
          activeTintColor="#e74c3c"
          inactiveTintColor="#2c3e50"
        />
        
        <DrawerItem
          label="Resources"
          icon={({ color, size }) => <Ionicons name="folder" size={size} color={color} />}
          onPress={() => props.navigation.navigate('Resources')}
          labelStyle={styles.drawerLabel}
          activeTintColor="#e74c3c"
          inactiveTintColor="#2c3e50"
        />
        
        <DrawerItem
          label="E-Library"
          icon={({ color, size }) => <Ionicons name="library" size={size} color={color} />}
          onPress={() => props.navigation.navigate('ELibrary')}
          labelStyle={styles.drawerLabel}
          activeTintColor="#e74c3c"
          inactiveTintColor="#2c3e50"
        />
        
        <DrawerItem
          label="Notices & Updates"
          icon={({ color, size }) => <Ionicons name="notifications" size={size} color={color} />}
          onPress={() => props.navigation.navigate('NoticesUpdates')}
          labelStyle={styles.drawerLabel}
          activeTintColor="#e74c3c"
          inactiveTintColor="#2c3e50"
        />
        
        <DrawerItem
          label="Achievement & Recognition"
          icon={({ color, size }) => <Ionicons name="trophy" size={size} color={color} />}
          onPress={() => props.navigation.navigate('AchievementRecognition')}
          labelStyle={styles.drawerLabel}
          activeTintColor="#e74c3c"
          inactiveTintColor="#2c3e50"
        />
        
        <DrawerItem
          label="About Developer"
          icon={({ color, size }) => <Ionicons name="code-slash" size={size} color={color} />}
          onPress={() => props.navigation.navigate('AboutDeveloper')}
          labelStyle={styles.drawerLabel}
          activeTintColor="#e74c3c"
          inactiveTintColor="#2c3e50"
        />
      </View>

      {/* Footer Section */}
      <View style={styles.drawerFooter}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={20} color="#ffffff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        
        <View style={styles.footerInfo}>
          <Text style={styles.footerText}>NSS Unit - VVIT Purnia</Text>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#f8f9fa',
          width: 280,
        },
        drawerActiveTintColor: '#e74c3c',
        drawerInactiveTintColor: '#2c3e50',
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={BottomTabNavigation}
        options={{
          title: 'Home/Dashboard',
        }}
      />
      <Drawer.Screen 
        name="About" 
        component={AboutScreen}
        options={{
          title: 'About NSS',
        }}
      />
      <Drawer.Screen 
        name="VolunteerZone" 
        component={VolunteerZone}
        options={{
          title: 'Volunteer Zone',
        }}
      />
      <Drawer.Screen 
        name="Resources" 
        component={Resources}
        options={{
          title: 'Resources',
        }}
      />
      <Drawer.Screen 
        name="ELibrary" 
        component={ELibrary}
        options={{
          title: 'E-Library',
        }}
      />
      <Drawer.Screen 
        name="NoticesUpdates" 
        component={NoticesUpdates}
        options={{
          title: 'Notices & Updates',
        }}
      />
      <Drawer.Screen 
        name="AchievementRecognition" 
        component={AchievementRecognition}
        options={{
          title: 'Achievement & Recognition',
        }}
      />
      <Drawer.Screen 
        name="AboutDeveloper" 
        component={AboutDeveloper}
        options={{
          title: 'About Developer',
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  drawerHeader: {
    backgroundColor: '#2c3e50',
    padding: 30,
    paddingTop: 50,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  logoContainer: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 30,
    marginBottom: 15,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  appSubtitle: {
    fontSize: 14,
    color: '#bdc3c7',
  },
  navigationSection: {
    flex: 1,
    paddingTop: 10,
  },
  drawerLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: -15,
  },
  drawerFooter: {
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    justifyContent: 'center',
  },
  logoutText: {
    color: '#ffffff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  footerInfo: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  versionText: {
    fontSize: 10,
    color: '#bdc3c7',
  },
});

export default DrawerNavigation;