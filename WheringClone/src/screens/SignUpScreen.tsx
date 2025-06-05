import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  SafeAreaView, ScrollView, Alert, ActivityIndicator
} from 'react-native';
import theme from '../styles/theme';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import { AuthStackParamList } from '../navigation/AuthNavigator'; // Import the param list

// A simple checkbox component - can be moved to a common components folder later
const Checkbox: React.FC<{ checked: boolean; onPress: () => void; label: React.ReactNode }> = ({ checked, onPress, label }) => (
  <TouchableOpacity onPress={onPress} style={styles.checkboxContainer}>
    <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
      {checked && <Text style={styles.checkboxCheckmark}>✓</Text>}
    </View>
    <View style={styles.checkboxLabelContainer}>{label}</View>
  </TouchableOpacity>
);

type SignUpScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SignUp'>;

const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Sign Up Error', 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Sign Up Error', 'Passwords do not match.');
      return;
    }
    if (!agreedToTerms) {
      Alert.alert('Sign Up Error', 'You must agree to the Terms of Service and Privacy Policy.');
      return;
    }
    setLoading(true);
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      // If sign up is successful, Firebase automatically signs the user in.
      // The user object is available in userCredential.user
      // We can now navigate to the next step of the onboarding process.
      if (userCredential.user) {
        // navigation.navigate('UserInfoScreen'); // Removed for now, will be handled by central auth state listener or next step.
        // For now, let's assume UserInfoScreen is the next step after basic SignUp.
        // Or, if your AppNavigator handles auth state, this navigation might not be needed here.
         navigation.navigate('UserInfoScreen');
      }
    } catch (error: any) {
      let errorMessage = 'An unknown error occurred.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'That email address is already in use!';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'That email address is invalid!';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      } else if (error.code === 'auth/network-request-failed'){
        errorMessage = 'Network error. Please check your connection.';
      }
      console.error('Sign Up Error:', error);
      Alert.alert('Sign Up Error', errorMessage);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Create Account</Text>
          
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
            placeholder="Password (min. 6 characters)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={theme.colors.secondaryText}
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholderTextColor={theme.colors.secondaryText}
          />
          
          <Checkbox
            checked={agreedToTerms}
            onPress={() => setAgreedToTerms(!agreedToTerms)}
            label={
              <Text style={styles.termsText}>
                I agree to the <Text style={styles.linkText}>Terms of Service</Text> and <Text style={styles.linkText}>Privacy Policy</Text>.
              </Text>
            }
          />
          
          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color={theme.colors.white} />
            ) : (
              <Text style={styles.signUpButtonText}>CREATE ACCOUNT</Text>
            )}
          </TouchableOpacity>
          
          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.signInLinkText}>Sign In</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: theme.spacing.lg,
    marginTop: theme.spacing.xs,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
    marginTop: theme.spacing.xs, // Align with text better
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
  },
  checkboxCheckmark: {
    color: theme.colors.white,
    fontSize: 12,
  },
  checkboxLabelContainer: {
    flex: 1, // Allow text to wrap
  },
  termsText: {
    fontSize: theme.typography.fontSizes.sm,
    fontFamily: theme.typography.fontFamilies.regular,
    color: theme.colors.secondaryText,
    lineHeight: theme.typography.fontSizes.sm * 1.4,
  },
  linkText: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
    fontFamily: theme.typography.fontFamilies.semiBold,
  },
  signUpButton: {
    width: '100%',
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
    height: 50, // Ensure consistent height
  },
  signUpButtonText: {
    fontSize: theme.typography.fontSizes.md,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.white,
  },
  signInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  signInText: {
    fontSize: theme.typography.fontSizes.sm,
    fontFamily: theme.typography.fontFamilies.regular,
    color: theme.colors.secondaryText,
  },
  signInLinkText: {
    fontSize: theme.typography.fontSizes.sm,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.primary,
  },
});

export default SignUpScreen;
