import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import theme from '../styles/theme';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Adjust based on your AuthNavigator/Onboarding stack param list
type UserInfoScreenNavigationProp = StackNavigationProp<any, 'UserInfoScreen'>;

const UserInfoScreen: React.FC = () => {
  const navigation = useNavigation<UserInfoScreenNavigationProp>();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthdate, setBirthdate] = useState(''); // For simplicity, using TextInput. Consider a DatePicker.

  const handleContinue = () => {
    if (!firstName || !lastName || !birthdate) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    // Basic validation for birthdate (e.g., format) could be added here.
    console.log('User Info:', { firstName, lastName, birthdate });
    // Navigate to the next onboarding screen (e.g., UsernameScreen)
    // Pass data along if needed, or save to a global state/context
    navigation.navigate('UsernameScreen', { firstName, lastName, birthdate });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Tell Us About Yourself</Text>
          <Text style={styles.subtitle}>Let's get your profile set up.</Text>
          
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
            placeholderTextColor={theme.colors.secondaryText}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
            placeholderTextColor={theme.colors.secondaryText}
          />

          <TextInput
            style={styles.input}
            placeholder="Birthdate (YYYY-MM-DD)" // Placeholder for date format
            value={birthdate}
            onChangeText={setBirthdate}
            keyboardType="numeric" // Or use a date picker component
            placeholderTextColor={theme.colors.secondaryText}
          />
          
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>CONTINUE</Text>
          </TouchableOpacity>
          
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
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.md,
    fontFamily: theme.typography.fontFamilies.regular,
    color: theme.colors.secondaryText,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
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
  continueButton: {
    width: '100%',
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  continueButtonText: {
    fontSize: theme.typography.fontSizes.md,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.white,
  },
});

export default UserInfoScreen;
