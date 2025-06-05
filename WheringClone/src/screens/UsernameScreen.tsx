import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  SafeAreaView, ScrollView, Alert, Image, ActivityIndicator
} from 'react-native';
import theme from '../styles/theme';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import { AuthStackParamList } from '../navigation/AuthNavigator';

type UsernameScreenRouteProp = RouteProp<AuthStackParamList, 'UsernameScreen'>;
type UsernameScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'UsernameScreen'>;

const UsernameScreen: React.FC = () => {
  const navigation = useNavigation<UsernameScreenNavigationProp>();
  const route = useRoute<UsernameScreenRouteProp>();
  const { firstName, lastName, birthdate } = route.params;

  const [username, setUsername] = useState('');
  const [profilePictureUri, setProfilePictureUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false); // For overall continue action

  const handleChoosePhoto = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
        cropperCircleOverlay: true,
        mediaType: 'photo',
      });

      if (image && image.path) {
        setUploading(true);
        const localImageUri = image.path;
        const currentUser = auth().currentUser;
        if (!currentUser) {
          Alert.alert('Error', 'User not authenticated.');
          setUploading(false);
          return;
        }

        const filename = `profile_${currentUser.uid}_${Date.now()}`;
        const storageRef = storage().ref(`profile_pictures/${filename}`);
        
        // Platform-specific path handling for Firebase Storage
        const uploadUri = Platform.OS === 'ios' ? localImageUri.replace('file://', '') : localImageUri;

        await storageRef.putFile(uploadUri);
        const downloadURL = await storageRef.getDownloadURL();
        
        setProfilePictureUri(downloadURL);
        Alert.alert('Success', 'Profile picture updated!');
        setUploading(false);
      }
    } catch (error: any) {
      setUploading(false);
      if (error.code === 'E_PICKER_CANCELLED') {
        console.log('User cancelled image picker');
      } else {
        console.error('ImagePicker Error: ', error);
        Alert.alert('Error', 'Could not select or upload image. Please ensure the app has permissions and react-native-image-crop-picker is correctly configured.');
      }
    }
  };

  const handleContinue = async () => {
    if (!username) {
      Alert.alert('Error', 'Please enter a username.');
      return;
    }
    setLoading(true);
    // Basic username validation (e.g., length, characters) can be added here.
    // TODO: Implement username availability check (backend Firestore interaction)
    // For now, we assume username is valid and proceed.
    
    console.log('User Info to pass:', { firstName, lastName, birthdate, username, profilePictureUri });
    navigation.navigate('InterestsScreen', {
      firstName,
      lastName,
      birthdate,
      username,
      profilePictureUri: profilePictureUri, // This will be the Firebase Storage URL if uploaded
    });
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Choose Your Username</Text>
          <Text style={styles.subtitle}>And add a profile picture (optional).</Text>
          
          <TouchableOpacity style={styles.profilePictureContainer} onPress={handleChoosePhoto} disabled={uploading || loading}>
            {profilePictureUri ? (
              <Image source={{ uri: profilePictureUri }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Icon name="camera-plus-outline" size={40} color={theme.colors.secondaryText} />
                <Text style={styles.profileImagePlaceholderText}>Add Photo</Text>
              </View>
            )}
            {uploading && (
              <View style={styles.uploadingOverlay}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
              </View>
            )}
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            placeholderTextColor={theme.colors.secondaryText}
            editable={!loading && !uploading}
          />
          
          <TouchableOpacity 
            style={[styles.continueButton, (loading || uploading) && styles.buttonDisabled]}
            onPress={handleContinue} 
            disabled={loading || uploading}
          >
            {loading ? (
                <ActivityIndicator size="small" color={theme.colors.white} /> 
            ) : (
                <Text style={styles.continueButtonText}>CONTINUE</Text>
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
  profilePictureContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileImagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImagePlaceholderText: {
    fontSize: theme.typography.fontSizes.sm,
    fontFamily: theme.typography.fontFamilies.regular,
    color: theme.colors.secondaryText,
    marginTop: theme.spacing.xs,
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject, // Cover the container
    backgroundColor: 'rgba(0,0,0,0.3)', // Semi-transparent overlay
    justifyContent: 'center',
    alignItems: 'center',
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
    height: 50,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.mediumGray,
  },
  continueButtonText: {
    fontSize: theme.typography.fontSizes.md,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.white,
  },
});

export default UsernameScreen;
