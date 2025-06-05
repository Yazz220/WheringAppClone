import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  SafeAreaView, Alert, ActivityIndicator
} from 'react-native';
import theme from '../styles/theme';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp, CommonActions } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

// Adjust based on your AuthNavigator param list
type LoginScreenNavigationProp = StackNavigationProp<any, 'Login'>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Login Error', 'Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      await auth().signInWithEmailAndPassword(email, password);
      // Navigation to MainApp will be handled by the central auth state listener (e.g., in AppNavigator)
      // So, we don't explicitly navigate here after successful login.
      // Alert.alert('Login Success', 'Welcome back!'); // Optional: if no central listener
    } catch (error: any) {
      let errorMessage = 'An unknown error occurred.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No user found with this email. Please sign up.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'That email address is invalid!';
      } else if (error.code === 'auth/network-request-failed'){
        errorMessage = 'Network error. Please check your connection.';
      }
      console.error('Login Error:', error);
      Alert.alert('Login Error', errorMessage);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back!</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={theme.colors.secondaryText}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={theme.colors.secondaryText}
        />
        
        <TouchableOpacity style={styles.forgotPasswordButton} onPress={() => Alert.alert('Forgot Password', 'Forgot password functionality to be implemented.')}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color={theme.colors.white} />
          ) : (
            <Text style={styles.loginButtonText}>SIGN IN</Text>
          )}
        </TouchableOpacity>
        
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signUpLinkText}>Sign Up</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.fontSizes.xl,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: theme.colors.lightGray,
    borderRadius: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    fontSize: theme.typography.fontSizes.md,
    fontFamily: theme.typography.fontFamilies.regular,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: theme.spacing.md,
  },
  forgotPasswordText: {
    fontSize: theme.typography.fontSizes.sm,
    fontFamily: theme.typography.fontFamilies.regular,
    color: theme.colors.primary,
  },
  loginButton: {
    width: '100%',
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
    height: 50, // Ensure consistent height with inputs
  },
  loginButtonText: {
    fontSize: theme.typography.fontSizes.md,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.white,
  },
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  signUpText: {
    fontSize: theme.typography.fontSizes.sm,
    fontFamily: theme.typography.fontFamilies.regular,
    color: theme.colors.secondaryText,
  },
  signUpLinkText: {
    fontSize: theme.typography.fontSizes.sm,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.primary,
  },
});

export default LoginScreen;
