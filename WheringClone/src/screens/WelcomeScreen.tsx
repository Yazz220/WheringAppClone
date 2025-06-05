import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import theme from '../styles/theme';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Assuming your AuthNavigator has aParamList like this:
// type AuthStackParamList = {
//   Welcome: undefined;
//   Login: undefined;
//   SignUp: undefined;
// };
// If not, you might need to adjust the type
type WelcomeScreenNavigationProp = StackNavigationProp<any, 'Welcome'>;

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.brandingContainer}>
          <Text style={styles.logoText}>Whering</Text>
          <Text style={styles.tagline}>Your digital wardrobe</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.signUpButton]} 
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={[styles.buttonText, styles.signUpButtonText]}>SIGN UP</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.signInButton]} 
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={[styles.buttonText, styles.signInButtonText]}>SIGN IN</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.socialLoginContainer}>
          <Text style={styles.socialLoginText}>Or continue with</Text>
          <View style={styles.socialButtonsRow}>
            {/* Placeholder for social buttons - functionality to be added later */}
            <TouchableOpacity style={styles.socialButton} onPress={() => console.log('Google Sign-In')}>
              <Text style={styles.socialButtonText}>G</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} onPress={() => console.log('Apple Sign-In')}>
              <Text style={styles.socialButtonText}>A</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to Whering's <Text style={styles.linkText}>Terms of Service</Text> and acknowledge you've read our <Text style={styles.linkText}>Privacy Policy</Text>.
          </Text>
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
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  brandingContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  logoText: {
    fontFamily: theme.typography.fontFamilies.extraBold,
    fontSize: theme.typography.fontSizes.xxl * 1.5, // Larger logo
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  tagline: {
    fontFamily: theme.typography.fontFamilies.regular,
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: theme.spacing.lg,
  },
  button: {
    paddingVertical: theme.spacing.md,
    borderRadius: 30, // More rounded buttons
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: theme.spacing.md,
    borderWidth: 1,
  },
  signUpButton: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  signInButton: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.primary,
  },
  buttonText: {
    fontFamily: theme.typography.fontFamilies.bold,
    fontSize: theme.typography.fontSizes.md,
  },
  signUpButtonText: {
    color: theme.colors.white,
  },
  signInButtonText: {
    color: theme.colors.primary,
  },
  socialLoginContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  socialLoginText: {
    fontFamily: theme.typography.fontFamilies.regular,
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.secondaryText,
    marginBottom: theme.spacing.md,
  },
  socialButtonsRow: {
    flexDirection: 'row',
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  socialButtonText: {
    fontFamily: theme.typography.fontFamilies.bold,
    fontSize: theme.typography.fontSizes.lg,
    color: theme.colors.text, // Or specific colors for Google/Apple
  },
  footer: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: theme.typography.fontFamilies.regular,
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.secondaryText,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeights.normal * theme.typography.fontSizes.xs,
  },
  linkText: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
});

export default WelcomeScreen;
