import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Alert, SafeAreaView, ActivityIndicator, Platform
} from 'react-native';
import theme from '../styles/theme';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Item } from './WardrobeScreen'; // Assuming Item interface is here
import { WardrobeStackParamList } from './ItemDetailsScreen'; // Using the same stack param list for now

type EditItemScreenRouteProp = RouteProp<WardrobeStackParamList, 'EditItemScreen'>;
type EditItemScreenNavigationProp = StackNavigationProp<WardrobeStackParamList, 'EditItemScreen'>;

const EditItemScreen: React.FC = () => {
  const navigation = useNavigation<EditItemScreenNavigationProp>();
  const route = useRoute<EditItemScreenRouteProp>();
  const existingItem = route.params.item;

  const [originalImageForDisplay, setOriginalImageForDisplay] = useState(existingItem.processedImageUrl || existingItem.originalImageUrl);
  const [newLocalImageUri, setNewLocalImageUri] = useState<string | null>(null);
  
  const [category, setCategory] = useState(existingItem.category);
  const [brand, setBrand] = useState(existingItem.brand || '');
  const [color, setColor] = useState(existingItem.color || '');
  const [size, setSize] = useState(existingItem.size || '');
  const [price, setPrice] = useState(existingItem.price?.toString() || '');
  const [tags, setTags] = useState(existingItem.tags?.join(', ') || '');
  const [notes, setNotes] = useState(existingItem.notes || '');
  
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleChoosePhoto = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 600, // Allow slightly larger for editing if needed
        height: 600,
        cropping: true,
        mediaType: 'photo',
        cropperAvoidEmptySpace: true,
        cropperSmartCropping: true,
      });
      if (image && image.path) {
        setNewLocalImageUri(image.path);
        setOriginalImageForDisplay(image.path); // Update display immediately
      }
    } catch (error: any) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        console.error('ImagePicker Error: ', error);
        Alert.alert('Error', 'Could not select image.');
      }
    }
  };

  const handleUpdateItem = async () => {
    if (!category.trim()) {
      Alert.alert('Error', 'Please enter a category for the item.');
      return;
    }

    const currentUser = auth().currentUser;
    if (!currentUser) {
      Alert.alert('Error', 'You must be logged in.');
      return;
    }

    setLoading(true);
    let finalImageUrl = existingItem.originalImageUrl;
    let finalProcessedImageUrl = existingItem.processedImageUrl;
    let itemStatus = existingItem.status;

    try {
      if (newLocalImageUri) {
        setUploadingImage(true);
        const filename = `item_${currentUser.uid}_${Date.now()}`;
        const storagePath = `item_images/${currentUser.uid}/${filename}`;
        const reference = storage().ref(storagePath);
        const uploadUri = Platform.OS === 'ios' ? newLocalImageUri.replace('file://', '') : newLocalImageUri;
        
        await reference.putFile(uploadUri);
        finalImageUrl = await reference.getDownloadURL();
        finalProcessedImageUrl = null; // Reset processed image as original has changed
        itemStatus = 'pending_processing'; // Mark for re-processing
        setUploadingImage(false);

        // Attempt to delete old images from storage if they exist and are different
        // This part can be complex due to original vs processed and if they were storage URLs
        // For simplicity, we focus on deleting the previous originalImageUrl if it was a Firebase Storage URL and changed.
        if (existingItem.originalImageUrl && existingItem.originalImageUrl !== finalImageUrl && existingItem.originalImageUrl.startsWith('gs://') || existingItem.originalImageUrl.includes('firebasestorage.googleapis.com')) {
          try {
            await storage().refFromURL(existingItem.originalImageUrl).delete();
          } catch (e) { console.warn('Could not delete old original image:', e); }
        }
        if (existingItem.processedImageUrl && existingItem.processedImageUrl.startsWith('gs://') || existingItem.processedImageUrl.includes('firebasestorage.googleapis.com')) {
          try {
            await storage().refFromURL(existingItem.processedImageUrl).delete();
          } catch (e) { console.warn('Could not delete old processed image:', e); }
        }
      }

      const updatedItemData: Partial<Item> & { updatedAt: firestore.FieldValue } = {
        category: category.trim(),
        brand: brand.trim(),
        color: color.trim(),
        size: size.trim(),
        price: price ? parseFloat(price) : null,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        notes: notes.trim(),
        originalImageUrl: finalImageUrl,
        processedImageUrl: finalProcessedImageUrl,
        status: itemStatus,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };
      // Remove undefined fields to avoid overwriting with null in Firestore update
      Object.keys(updatedItemData).forEach(key => 
        (updatedItemData as any)[key] === undefined && delete (updatedItemData as any)[key]
      );

      await firestore().collection('items').doc(existingItem.id).update(updatedItemData);

      Alert.alert('Success', 'Item updated successfully!');
      setLoading(false);
      navigation.goBack(); // Go back to ItemDetailsScreen

    } catch (error: any) {
      console.error('Error updating item:', error);
      Alert.alert('Error', 'Could not update item. ' + error.message);
      setLoading(false);
      setUploadingImage(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <TouchableOpacity onPress={handleChoosePhoto} disabled={loading || uploadingImage}>
            <Image source={{ uri: originalImageForDisplay }} style={styles.imagePreview} resizeMode="contain" />
            <View style={styles.changeImageOverlay}>
              <Icon name="camera-retake-outline" size={24} color={theme.colors.white} />
              <Text style={styles.changeImageText}>Change Image</Text>
            </View>
            {uploadingImage && 
              <View style={styles.uploadingIndicatorContainer}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
                <Text style={styles.uploadingText}>Uploading...</Text>
              </View>
            }
          </TouchableOpacity>

          <Text style={styles.label}>Category*</Text>
          <TextInput style={styles.input} placeholder="E.g., Tops, Bottoms" value={category} onChangeText={setCategory} />
          <Text style={styles.label}>Brand</Text>
          <TextInput style={styles.input} placeholder="E.g., Nike, Zara" value={brand} onChangeText={setBrand} />
          <Text style={styles.label}>Color</Text>
          <TextInput style={styles.input} placeholder="E.g., Red, Blue" value={color} onChangeText={setColor} />
          <Text style={styles.label}>Size</Text>
          <TextInput style={styles.input} placeholder="E.g., M, 10" value={size} onChangeText={setSize} />
          <Text style={styles.label}>Price (Optional)</Text>
          <TextInput style={styles.input} placeholder="E.g., 29.99" value={price} onChangeText={setPrice} keyboardType="numeric" />
          <Text style={styles.label}>Tags (comma-separated)</Text>
          <TextInput style={styles.input} placeholder="E.g., summer, casual" value={tags} onChangeText={setTags} />
          <Text style={styles.label}>Notes (Optional)</Text>
          <TextInput style={[styles.input, styles.multilineInput]} placeholder="E.g., Gift" value={notes} onChangeText={setNotes} multiline />

          <TouchableOpacity 
            style={[styles.button, (loading || uploadingImage) && styles.buttonDisabled]}
            onPress={handleUpdateItem}
            disabled={loading || uploadingImage}
          >
            {loading ? 
              <ActivityIndicator size="small" color={theme.colors.white} /> :
              <Text style={styles.buttonText}>SAVE CHANGES</Text>
            }
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  scrollView: { flex: 1 },
  container: { padding: theme.spacing.md },
  imagePreview: {
    width: '100%',
    height: 300,
    borderRadius: theme.spacing.sm,
    marginBottom: theme.spacing.xs, // Reduced margin as overlay is part of it
    backgroundColor: theme.colors.lightGray,
    position: 'relative',
  },
  changeImageOverlay: {
    position: 'absolute',
    bottom: theme.spacing.xs + 5, // Adjusted to be on the image
    right: theme.spacing.md,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeImageText: {
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamilies.semiBold,
    fontSize: theme.typography.fontSizes.xs,
    marginLeft: theme.spacing.xs,
  },
  uploadingIndicatorContainer: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: theme.spacing.sm, 
  },
  uploadingText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamilies.semiBold,
    marginTop: theme.spacing.xs,
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
  buttonDisabled: { backgroundColor: theme.colors.mediumGray },
  buttonText: {
    fontSize: theme.typography.fontSizes.md,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.white,
  },
});

export default EditItemScreen;
