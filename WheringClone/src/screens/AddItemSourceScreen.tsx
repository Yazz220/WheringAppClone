import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert
} from 'react-native';
import theme from '../styles/theme';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import ImagePicker from 'react-native-image-crop-picker'; // For Camera/Library

// This screen will likely be part of a new stack, let's call it AddItemStack
// Define param list for this new stack if it includes more screens with params
// For now, assuming navigation prop can navigate to 'AddItemDetails'.
type AddItemSourceNavigationProp = StackNavigationProp<any, 'AddItemSourceScreen'>;

const AddItemSourceScreen: React.FC = () => {
  const navigation = useNavigation<AddItemSourceNavigationProp>();

  const handleSelectSource = (source: 'camera' | 'library' | 'url') => {
    switch (source) {
      case 'camera':
        Alert.alert("TODO", "Camera integration with react-native-image-crop-picker needed.");
        // ImagePicker.openCamera({ cropping: true }) // Example
        //   .then(image => navigation.navigate('AddItemDetails', { imageUri: image.path }))
        //   .catch(err => console.log(err));
        break;
      case 'library':
        Alert.alert("TODO", "Photo Library integration with react-native-image-crop-picker needed.");
        // ImagePicker.openPicker({ cropping: true }) // Example
        //   .then(image => navigation.navigate('AddItemDetails', { imageUri: image.path }))
        //   .catch(err => console.log(err));
        break;
      case 'url':
        Alert.alert("TODO", "Implement URL input for image.");
        // Potentially show a modal or navigate to a screen to input URL
        // Then navigate to AddItemDetails with the URL
        // navigation.navigate('AddItemDetails', { imageUrl: 'http://example.com/image.jpg' }); 
        break;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Add New Item</Text>
        <Text style={styles.subtitle}>Choose the source of your item's image:</Text>

        <TouchableOpacity style={styles.optionButton} onPress={() => handleSelectSource('camera')}>
          <Icon name="camera-outline" size={24} color={theme.colors.primary} style={styles.icon} />
          <Text style={styles.optionText}>Take a Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton} onPress={() => handleSelectSource('library')}>
          <Icon name="image-multiple-outline" size={24} color={theme.colors.primary} style={styles.icon} />
          <Text style={styles.optionText}>Choose from Library</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton} onPress={() => handleSelectSource('url')}>
          <Icon name="link-variant" size={24} color={theme.colors.primary} style={styles.icon} />
          <Text style={styles.optionText}>Add from URL</Text>
        </TouchableOpacity>
        
        {/* Optional: Button to go back if this screen is part of a modal stack */}
        {/* <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>CANCEL</Text>
        </TouchableOpacity> */}
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
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.md,
    fontFamily: theme.typography.fontFamilies.regular,
    color: theme.colors.secondaryText,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.lightGray,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    width: '90%',
    marginBottom: theme.spacing.md,
  },
  icon: {
    marginRight: theme.spacing.md,
  },
  optionText: {
    fontSize: theme.typography.fontSizes.md,
    fontFamily: theme.typography.fontFamilies.semiBold,
    color: theme.colors.text,
  },
  cancelButton: {
    marginTop: theme.spacing.lg,
    padding: theme.spacing.md,
  },
  cancelButtonText: {
    fontSize: theme.typography.fontSizes.md,
    fontFamily: theme.typography.fontFamilies.semiBold,
    color: theme.colors.primary,
  },
});

export default AddItemSourceScreen;
