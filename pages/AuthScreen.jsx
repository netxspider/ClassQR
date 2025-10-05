import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Login from '../components/Login';
import Signup from '../components/Signup';
import RoleSelection from '../components/RoleSelection';

const AuthScreen = () => {
  const [currentScreen, setCurrentScreen] = useState('role'); // 'role', 'login', 'signup'
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    setCurrentScreen('login');
  };

  const switchToSignup = () => setCurrentScreen('signup');
  const switchToLogin = () => setCurrentScreen('login');
  const goBackToRoles = () => {
    setCurrentScreen('role');
    setSelectedRole(null);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'role':
        return <RoleSelection onSelectRole={handleRoleSelection} />;
      case 'login':
        return (
          <Login
            onSwitchToSignup={switchToSignup}
            selectedRole={selectedRole}
            onBack={goBackToRoles}
          />
        );
      case 'signup':
        return (
          <Signup
            onSwitchToLogin={switchToLogin}
            selectedRole={selectedRole}
            onBack={goBackToRoles}
          />
        );
      default:
        return <RoleSelection onSelectRole={handleRoleSelection} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <View style={styles.content}>
        {renderScreen()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
  },
});

export default AuthScreen;