import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import AuthScreen from '../pages/AuthScreen';
import BottomTabNavigation from './BottomTabNavigation';
import DrawerNavigation from './DrawerNavigation';
import MarkAttendanceScreen from '../Teacher/MarkAttendanceScreen';

const StackNavigation = () => {
  const Stack = createStackNavigator();
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="Main" options={{ headerShown: false }}>
            {() => userRole === 'volunteer' ? <DrawerNavigation /> : <BottomTabNavigation role={userRole} />}
          </Stack.Screen>
          <Stack.Screen 
            name="MarkAttendance" 
            component={MarkAttendanceScreen} 
            options={{ headerShown: false }} 
          />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthScreen} />
      )}
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({
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
});

export default StackNavigation