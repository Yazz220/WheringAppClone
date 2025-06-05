import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Switch, Alert
} from 'react-native';
import theme from '../styles/theme';
import { useNavigation, useRoute, RouteProp, CommonActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { AuthStackParamList } from '../navigation/AuthNavigator'; // Assuming this is the correct path

// Define the params passed to this screen
type InterestsScreenRouteProp = RouteProp<AuthStackParamList, 'InterestsScreen'>;

// Adjust based on your Navigator param list
type InterestsScreenNavigationProp = StackNavigationProp<any, 'InterestsScreen'>; // Use any for now if MainApp isn't in AuthStackParamList

const INTEREST_OPTIONS = [
  'Sustainable Fashion', 'Minimalism', 'Vintage Finds', 'Streetwear', 'Luxury Brands',
  'Capsule Wardrobe', 'DIY Fashion', 'Second-hand Shopping', 'Ethical Fashion',
  'Seasonal Trends', 'Comfort Core', 'Accessorizing'
];

const SelectableInterest: React.FC<{ title: string; selected: boolean; onPress: () => void }> = ({ title, selected, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.interestChip, selected && styles.interestChipSelected]}
      onPress={onPress}
    >
      <Text style={[styles.interestText, selected && styles.interestTextSelected]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const InterestsScreen: React.FC = () => {
  const navigation = useNavigation<InterestsScreenNavigationProp>();
  const route = useRoute<InterestsScreenRouteProp>();
  const { firstName, lastName, birthdate, username, profilePictureUri } = route.params;

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [loading, setLoading] = useState(false);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(item => item !== interest) : [...prev, interest]
    );
  };

  const handleCompleteProfile = async () => {
    const currentUser = auth().currentUser;
    if (!currentUser) {
      Alert.alert('Error', 'No authenticated user found. Please sign in again.');
      // Potentially navigate back to Welcome or Login
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Welcome' }],
        })
      );
      return;
    }

    setLoading(true);
    const userProfileData = {
      uid: currentUser.uid,
      email: currentUser.email, // Save email for reference
      firstName,
      lastName,
      birthdate,
      username,
      profilePictureUrl: profilePictureUri, // Will be updated with actual Storage URL later
      interests: selectedInterests,
      notificationsEnabled: enableNotifications,
      createdAt: firestore.FieldValue.serverTimestamp(), // Use server timestamp
      updatedAt: firestore.FieldValue.serverTimestamp(),
    };

    try {
      await firestore().collection('users').doc(currentUser.uid).set(userProfileData);
      console.log('User profile data saved to Firestore!', userProfileData);
      Alert.alert(
        'Profile Complete',
        'Your profile has been set up successfully!'
      );
      
      // Navigate to the main app stack, resetting the navigation stack
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'MainApp' }], // Replace 'MainApp' with your actual main app navigator name in the root navigator
        })
      );
    } catch (error: any) {
      console.error('Firestore Error:', error);
      Alert.alert('Error', 'Could not save your profile. Please try again.');
      setLoading(false);
    }
    // setLoading(false); // This should be inside the try/catch or in a finally block if navigation doesn't occur on error
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>What are your style interests?</Text>
          <Text style={styles.subtitle}>Select a few to help us personalize your experience.</Text>
          
          <View style={styles.interestsContainer}>
            {INTEREST_OPTIONS.map(interest => (
              <SelectableInterest
                key={interest}
                title={interest}
                selected={selectedInterests.includes(interest)}
                onPress={() => toggleInterest(interest)}
              />
            ))}
          </View>

          <View style={styles.notificationSettingContainer}>
            <Text style={styles.notificationText}>Enable Notifications</Text>
            <Switch
              trackColor={{ false: theme.colors.mediumGray, true: theme.colors.primary }}
              thumbColor={enableNotifications ? theme.colors.white : theme.colors.lightGray}
              ios_backgroundColor={theme.colors.mediumGray}
              onValueChange={setEnableNotifications}
              value={enableNotifications}
              disabled={loading}
            />
          </View>
          
          <TouchableOpacity 
            style={[styles.completeButton, loading && styles.buttonDisabled]}
            onPress={handleCompleteProfile} 
            disabled={loading}
          >
            {loading ? (
              <Text style={styles.completeButtonText}>SAVING...</Text>
            ) : (
              <Text style={styles.completeButtonText}>FINISH SETUP</Text>
            )}
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
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
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
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  interestChip: {
    backgroundColor: theme.colors.lightGray,
    borderRadius: 20,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    margin: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  interestChipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  interestText: {
    fontFamily: theme.typography.fontFamilies.regular,
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text,
  },
  interestTextSelected: {
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamilies.semiBold,
  },
  notificationSettingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm, 
    backgroundColor: theme.colors.lightGray,
    borderRadius: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  notificationText: {
    fontSize: theme.typography.fontSizes.md,
    fontFamily: theme.typography.fontFamilies.semiBold,
    color: theme.colors.text,
  },
  completeButton: {
    width: '100%',
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.md,
    height: 50, // Consistent height
  },
  buttonDisabled: {
    backgroundColor: theme.colors.mediumGray,
  },
  completeButtonText: {
    fontSize: theme.typography.fontSizes.md,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.white,
  },
});

export default InterestsScreen;
