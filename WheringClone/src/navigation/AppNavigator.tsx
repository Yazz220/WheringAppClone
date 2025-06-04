import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';

// Placeholder for authentication state
// In a real app, this would come from a context, Redux, Zustand, or Firebase Auth listener
const isAuthenticated = false; // Set to true to see MainTabNavigator, false for AuthNavigator

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;