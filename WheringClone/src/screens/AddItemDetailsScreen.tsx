import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Alert, SafeAreaView, ActivityIndicator, Platform
} from 'react-native';
import theme from '../styles/theme';
import { useNavigation, useRoute, RouteProp, CommonActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AddItemStackParamList } from '../navigation/AddItemStack';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';

type AddItemDetailsScreenRouteProp = RouteProp<AddItemStackParamList, 'AddItemDetails'>;
type AddItemDetailsNavigationProp = StackNavigationProp<AddItemStackParamList, 'AddItemDetails'>;

const AddItemDetailsScreen: React.FC = () => {
  const navigation = useNavigation<AddItemDetailsNavigationProp>();
  const route = useRoute<AddItemDetailsScreenRouteProp>();

  const localImageUri = route.params?.imageUri;
  const remoteImageUrl = route.params?.imageUrl;
  const imageToDisplay = localImageUri || remoteImageUrl;

  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [price, setPrice] = useState('');
  const [tags, setTags] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!imageToDisplay) {
      Alert.alert('Error', 'No image was provided. Please go back and select an image.');
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    }
  }, [imageToDisplay, navigation]);

  const handleSaveItem = async () => {
    if (!imageToDisplay) {
      Alert.alert('Error', 'No image to save.');
      return;
    }
    if (!category.trim()) {
      Alert.alert('Error', 'Please enter a category for the item.');
      return;
    }

    const currentUser = auth().currentUser;
    if (!currentUser) {
      Alert.alert('Error', 'You must be logged in to save items.');
      // Potentially navigate to login
      return;
    }

    setLoading(true);
    let finalImageUrl = remoteImageUrl; // Use remote URL directly if provided

    try {
      // If it's a local image URI, upload to Firebase Storage
      if (localImageUri) {
        const filename = `item_${currentUser.uid}_${Date.now()}`;
        const storagePath = `item_images/${currentUser.uid}/${filename}`;
        const reference = storage().ref(storagePath);
        
        const uploadUri = Platform.OS === 'ios' ? localImageUri.replace('file://', '') : localImageUri;
        await reference.putFile(uploadUri);
        finalImageUrl = await reference.getDownloadURL();
      }

      if (!finalImageUrl) {
        Alert.alert('Error', 'Could not process image URL.');
        setLoading(false);
        return;
      }

      const itemData = {
        userId: currentUser.uid,
        originalImageUrl: finalImageUrl, // This is the URL in Firebase Storage or the original web URL
        processedImageUrl: null, // To be updated by backend processing
        category: category.trim(),
        brand: brand.trim(),
        color: color.trim(),
        size: size.trim(),
        price: price ? parseFloat(price) : null,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        notes: notes.trim(),
        status: 'pending_processing', // Initial status for backend functions to pick up
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      await firestore().collection('items').add(itemData);

      Alert.alert('Success', 'Item saved! It will be processed shortly.');
      setLoading(false);

      // Navigate back to the Wardrobe or clear the AddItemStack
      // For example, go back to the beginning of the AddItem flow or to the main tab
      // This might need to be adjusted based on where AddItemStack is mounted
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'AddItemSource' }], // Go back to the start of AddItemStack
        })
      );
      // Or, if AddItemStack is a tab, you might want to switch tabs:
      // navigation.getParent()?.navigate('Wardrobe'); 

    } catch (error: any) {
      console.error('Error saving item:', error);
      Alert.alert('Error', 'Could not save item. ' + error.message);
      setLoading(false);
    }
  };

  if (!imageToDisplay) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.containerCentered}>
          <Text style={styles.errorText}>No image selected. Please go back.</Text>
          <TouchableOpacity onPress={() => navigation.canGoBack() && navigation.goBack()} style={styles.button}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Image source={{ uri: imageToDisplay }} style={styles.imagePreview} resizeMode="contain" />

          <Text style={styles.label}>Category*</Text>
          <TextInput
            style={styles.input}
            placeholder="E.g., Tops, Bottoms, Shoes"
            value={category}
            onChangeText={setCategory}
            placeholderTextColor={theme.colors.secondaryText}
          />

          <Text style={styles.label}>Brand</Text>
          <TextInput
            style={styles.input}
            placeholder="E.g., Nike, Zara, Levi's"
            value={brand}
            onChangeText={setBrand}
            placeholderTextColor={theme.colors.secondaryText}
          />

          <Text style={styles.label}>Color</Text>
          <TextInput
            style={styles.input}
            placeholder="E.g., Red, Blue, Black & White"
            value={color}
            onChangeText={setColor}
            placeholderTextColor={theme.colors.secondaryText}
          />

          <Text style={styles.label}>Size</Text>
          <TextInput
            style={styles.input}
            placeholder="E.g., M, 10, OS (One Size)"
            value={size}
            onChangeText={setSize}
            placeholderTextColor={theme.colors.secondaryText}
          />

          <Text style={styles.label}>Price (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="E.g., 29.99"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            placeholderTextColor={theme.colors.secondaryText}
          />

          <Text style={styles.label}>Tags (comma-separated)</Text>
          <TextInput
            style={styles.input}
            placeholder="E.g., summer, casual, cotton"
            value={tags}
            onChangeText={setTags}
            placeholderTextColor={theme.colors.secondaryText}
          />

          <Text style={styles.label}>Notes (Optional)</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="E.g., Gift from mom, special occasions"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            placeholderTextColor={theme.colors.secondaryText}
          />

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSaveItem}
            disabled={loading}
          >
            {loading ? 
              <ActivityIndicator size="small" color={theme.colors.white} /> :
              <Text style={styles.buttonText}>SAVE ITEM</Text>
            }
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
  scrollView: {
    flex: 1,
  },
  container: {
    padding: theme.spacing.md,
  },
  containerCentered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  errorText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.error,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 300,
    borderRadius: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.lightGray,
  },
  label: {
    fontSize: theme.typography.fontSizes.sm,
    fontFamily: theme.typography.fontFamilies.semiBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.sm,
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
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: theme.spacing.sm,
  },
  button: {
    width: '100%',
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    height: 50,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.mediumGray,
  },
  buttonText: {
    fontSize: theme.typography.fontSizes.md,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.white,
  },
});

export default AddItemDetailsScreen;
