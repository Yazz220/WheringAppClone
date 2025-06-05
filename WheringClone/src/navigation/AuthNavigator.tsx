import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import UserInfoScreen from '../screens/UserInfoScreen';
import UsernameScreen from '../screens/UsernameScreen';
import InterestsScreen from '../screens/InterestsScreen';

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  UserInfoScreen: undefined; // Can be undefined if no params are strictly required initially
  UsernameScreen: { // Params expected from UserInfoScreen
    firstName: string;
    lastName: string;
    birthdate: string;
  };
  InterestsScreen: { // Params expected from UsernameScreen
    firstName: string;
    lastName: string;
    birthdate: string;
    username: string;
    profilePictureUri: string | null;
  };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="UserInfoScreen" component={UserInfoScreen} />
      <Stack.Screen name="UsernameScreen" component={UsernameScreen} />
      <Stack.Screen name="InterestsScreen" component={InterestsScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;