import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, Image,
  TouchableOpacity, ActivityIndicator, Alert
} from 'react-native';
import theme from '../styles/theme';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage'; // Import Firebase Storage
import { Item } from './WardrobeScreen'; // Import the Item interface
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export type WardrobeStackParamList = {
  WardrobeHome: undefined; 
  ItemDetails: { itemId: string };
  EditItemScreen: { item: Item }; // Added for editing
};

type ItemDetailsScreenRouteProp = RouteProp<WardrobeStackParamList, 'ItemDetails'>;
type ItemDetailsScreenNavigationProp = StackNavigationProp<WardrobeStackParamList, 'ItemDetails'>;

const ItemDetailsScreen: React.FC = () => {
  const route = useRoute<ItemDetailsScreenRouteProp>();
  const navigation = useNavigation<ItemDetailsScreenNavigationProp>();
  const { itemId } = route.params;

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const subscriber = firestore()
      .collection('items')
      .doc(itemId)
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot.exists) {
          setItem({ id: documentSnapshot.id, ...documentSnapshot.data() } as Item);
        } else {
          Alert.alert('Error', 'Item not found or has been deleted.');
          if(navigation.canGoBack()) navigation.goBack();
        }
        setLoading(false);
      }, error => {
        console.error("Error fetching item details: ", error);
        Alert.alert('Error', 'Could not fetch item details.');
        if(navigation.canGoBack()) navigation.goBack();
        setLoading(false);
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, [itemId, navigation]);

  const handleDeleteItem = async () => {
    if (!item) return;

    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              // Attempt to delete image from Firebase Storage
              // This assumes originalImageUrl holds the Firebase Storage gs:// or https:// URL
              // If multiple images (original, processed), logic needs to be more complex
              const imageUrlToDelete = item.processedImageUrl || item.originalImageUrl;
              if (imageUrlToDelete) {
                try {
                  const storageRef = storage().refFromURL(imageUrlToDelete);
                  await storageRef.delete();
                  console.log('Image deleted from Firebase Storage successfully.');
                } catch (storageError: any) {
                  // Log storage error but proceed with Firestore deletion if image not found or other error
                  console.warn('Could not delete image from Storage: ', storageError.message);
                  // If error is 'storage/object-not-found', it's fine, maybe already deleted or not a storage URL.
                  if (storageError.code !== 'storage/object-not-found') {
                     // Optionally, alert user about image deletion failure if it's critical
                     // Alert.alert('Warning', 'Could not delete associated image from storage.');
                  }
                }
              }

              await firestore().collection('items').doc(item.id).delete();
              Alert.alert('Success', 'Item deleted successfully.');
              if(navigation.canGoBack()) navigation.goBack();
            } catch (error: any) {
              console.error("Error deleting item: ", error);
              Alert.alert('Error', 'Could not delete item. ' + error.message);
            }
            setDeleting(false);
          },
        },
      ]
    );
  };

  const handleEditItem = () => {
    if (!item) return;
    // Navigate to an EditItemScreen, passing the current item data
    navigation.navigate('EditItemScreen', { item });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeAreaCentered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading item details...</Text>
      </SafeAreaView>
    );
  }

  if (!item) {
    // This case should ideally be handled by the snapshot listener navigating back
    return (
      <SafeAreaView style={styles.safeAreaCentered}>
        <Text style={styles.errorText}>Item not found.</Text>
      </SafeAreaView>
    );
  }

  const displayImageUrl = item.processedImageUrl || item.originalImageUrl;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {displayImageUrl ? (
          <Image source={{ uri: displayImageUrl }} style={styles.image} resizeMode="contain" />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Icon name="image-off-outline" size={80} color={theme.colors.mediumGray} />
          </View>
        )}

        <View style={styles.detailsContainer}>
          <Text style={styles.categoryText}>{item.category}</Text>
          {item.brand && <Text style={styles.detailText}><Text style={styles.detailLabel}>Brand:</Text> {item.brand}</Text>}
          {item.color && <Text style={styles.detailText}><Text style={styles.detailLabel}>Color:</Text> {item.color}</Text>}
          {item.size && <Text style={styles.detailText}><Text style={styles.detailLabel}>Size:</Text> {item.size}</Text>}
          {item.price !== null && item.price !== undefined && (
            <Text style={styles.detailText}><Text style={styles.detailLabel}>Price:</Text> ${item.price.toFixed(2)}</Text>
          )}
          {item.tags && item.tags.length > 0 && (
            <Text style={styles.detailText}><Text style={styles.detailLabel}>Tags:</Text> {item.tags.join(', ')}</Text>
          )}
          {item.notes && <Text style={styles.detailText}><Text style={styles.detailLabel}>Notes:</Text> {item.notes}</Text>}
          <Text style={styles.detailText}><Text style={styles.detailLabel}>Status:</Text> {item.status}</Text>
          {item.createdAt && (
             <Text style={styles.detailTextSmall}>Added: {new Date(item.createdAt.toDate()).toLocaleDateString()}</Text>
          )}
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={[styles.button, styles.editButton]} onPress={handleEditItem} disabled={deleting || loading}>
            <Icon name="pencil-outline" size={20} color={theme.colors.white} />
            <Text style={styles.buttonText}>EDIT</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.deleteButton, (deleting || loading) && styles.buttonDisabled]}
            onPress={handleDeleteItem}
            disabled={deleting || loading}
          >
            {deleting ? 
              <ActivityIndicator size="small" color={theme.colors.white} /> : 
              <Icon name="trash-can-outline" size={20} color={theme.colors.white} />
            }
            <Text style={styles.buttonText}>{deleting ? 'DELETING...' : 'DELETE'}</Text>
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
  safeAreaCentered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  scrollViewContent: {
    paddingBottom: theme.spacing.lg,
  },
  loadingText: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.secondaryText,
  },
  errorText: {
    fontSize: theme.typography.fontSizes.lg,
    color: theme.colors.error,
  },
  image: {
    width: '100%',
    height: 350, 
    backgroundColor: theme.colors.lightGray,
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    padding: theme.spacing.lg,
  },
  categoryText: {
    fontSize: theme.typography.fontSizes.xl,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textTransform: 'capitalize',
  },
  detailText: {
    fontSize: theme.typography.fontSizes.md,
    fontFamily: theme.typography.fontFamilies.regular,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    lineHeight: theme.typography.fontSizes.md * 1.5,
  },
  detailLabel: {
    fontFamily: theme.typography.fontFamilies.semiBold,
  },
  detailTextSmall: {
    fontSize: theme.typography.fontSizes.xs,
    fontFamily: theme.typography.fontFamilies.regular,
    color: theme.colors.secondaryText,
    marginTop: theme.spacing.sm,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.lg,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: 30,
    minWidth: '45%',
    height: 50,
  },
  buttonText: {
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamilies.bold,
    fontSize: theme.typography.fontSizes.md,
    marginLeft: theme.spacing.sm,
  },
  editButton: {
    backgroundColor: theme.colors.skyBlue, // Changed color for edit
  },
  deleteButton: {
    backgroundColor: theme.colors.error,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.mediumGray,
  },
});

export default ItemDetailsScreen;
