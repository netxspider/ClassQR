import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import SDashboard from '../Student/SDashboard';
import TDashboard from '../Teacher/TDashboard';
import AttendanceScreen from '../Teacher/AttendanceScreen';
import ScanQRScreen from '../Student/ScanQRScreen';
import SimpleScanQRScreen from '../Student/SimpleScanQRScreen';
import ProfileScreen from '../components/ProfileScreen';

const BottomTabNavigation = ({ role }) => {
  const BottomTabs = createBottomTabNavigator();

  return (
    <BottomTabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Attendance') {
            iconName = focused ? 'clipboard' : 'clipboard-outline';
          } else if (route.name === 'Scan QR') {
            iconName = focused ? 'qr-code' : 'qr-code-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: role === 'teacher' ? '#27ae60' : '#3498db',
        tabBarInactiveTintColor: '#95a5a6',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#ecf0f1',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      })}
    >
      {role === 'teacher' ? (
        <>
          <BottomTabs.Screen name="Dashboard" component={TDashboard} />
          <BottomTabs.Screen name="Attendance" component={AttendanceScreen} />
          <BottomTabs.Screen name="Profile" component={ProfileScreen} />
        </>
      ) : (
        <>
          <BottomTabs.Screen name="Dashboard" component={SDashboard} />
          <BottomTabs.Screen name="Scan QR" component={SimpleScanQRScreen} />
          <BottomTabs.Screen name="Profile" component={ProfileScreen} />
        </>
      )}
    </BottomTabs.Navigator>
  );
}

export default BottomTabNavigation