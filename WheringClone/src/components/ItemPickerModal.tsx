import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal, View, Text, StyleSheet, FlatList, Image, TouchableOpacity,
  SafeAreaView, ActivityIndicator, TextInput, ScrollView
} from 'react-native';
import theme from '../styles/theme';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Item } from '../screens/WardrobeScreen'; // Assuming Item interface is here
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ItemPickerModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectItem: (item: Item) => void;
}

const CATEGORIES = [
  'All', 'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories', 'Bags', 'Jewelry', 'Sportswear'
];

const ItemPickerModal: React.FC<ItemPickerModalProps> = ({ isVisible, onClose, onSelectItem }) => {
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const currentUser = auth().currentUser;
    if (!currentUser) {
      setLoading(false);
      setAllItems([]);
      return;
    }
    try {
      const snapshot = await firestore()
        .collection('items')
        .where('userId', '==', currentUser.uid)
        // .where('status', '==', 'processed') // Consider only showing processed items
        .orderBy('createdAt', 'desc')
        .get();
      const userItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Item));
      setAllItems(userItems);
    } catch (error) {
      console.error("Error fetching items for picker: ", error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isVisible) {
      fetchItems();
    }
  }, [isVisible, fetchItems]);

  useEffect(() => {
    let itemsToDisplay = allItems;
    if (selectedCategory !== 'All') {
      itemsToDisplay = itemsToDisplay.filter(item => item.category.toLowerCase() === selectedCategory.toLowerCase());
    }
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      itemsToDisplay = itemsToDisplay.filter(item => 
        item.category.toLowerCase().includes(lowerSearchTerm) ||
        (item.brand && item.brand.toLowerCase().includes(lowerSearchTerm)) ||
        (item.color && item.color.toLowerCase().includes(lowerSearchTerm))
      );
    }
    setFilteredItems(itemsToDisplay);
  }, [allItems, selectedCategory, searchTerm]);

  const handleSelectItem = (item: Item) => {
    onSelectItem(item);
    // onClose(); // Optionally close modal immediately after selection
  };

  const renderItem = ({ item }: { item: Item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => handleSelectItem(item)}>
      <Image 
        source={{ uri: item.processedImageUrl || item.originalImageUrl }}
        style={styles.itemImage}
        resizeMode="cover"
      />
      <Text style={styles.itemCategory} numberOfLines={1}>{item.category}</Text>
    </TouchableOpacity>
  );
  
  const CategoryChip: React.FC<{ category: string }> = ({ category }) => (
    <TouchableOpacity 
      style={[styles.chip, selectedCategory === category && styles.chipSelected]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text style={[styles.chipText, selectedCategory === category && styles.chipTextSelected]}>
        {category}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Select Item</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.filterContainer}>
          <View style={styles.searchContainer}>
            <Icon name="magnify" size={20} color={theme.colors.secondaryText} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search your items..."
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholderTextColor={theme.colors.secondaryText}
            />
            {searchTerm.length > 0 && (
                <TouchableOpacity onPress={() => setSearchTerm('')} style={styles.clearSearchButton}>
                <Icon name="close-circle" size={20} color={theme.colors.secondaryText} />
                </TouchableOpacity>
            )}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainer}>
            {CATEGORIES.map(cat => <CategoryChip key={cat} category={cat} />)}
          </ScrollView>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : filteredItems.length === 0 ? (
          <View style={styles.loadingContainer}> 
            <Text style={styles.emptyText}>No items found.</Text>
          </View>
        ) : (
          <FlatList
            data={filteredItems}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            numColumns={3} // More items visible in picker
            contentContainerStyle={styles.listContentContainer}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.text,
  },
  closeButton: { padding: theme.spacing.xs },
  filterContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.white, 
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.lightGray,
    borderRadius: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    height: 40,
    marginBottom: theme.spacing.sm,
  },
  searchIcon: { marginRight: theme.spacing.sm },
  searchInput: {
    flex: 1,
    fontSize: theme.typography.fontSizes.sm,
    fontFamily: theme.typography.fontFamilies.regular,
    color: theme.colors.text,
  },
  clearSearchButton: { padding: theme.spacing.xs },
  chipsContainer: { paddingVertical: theme.spacing.sm },
  chip: {
    backgroundColor: theme.colors.lightGray,
    borderRadius: 20,
    paddingVertical: theme.spacing.xs + 2,
    paddingHorizontal: theme.spacing.md,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    fontFamily: theme.typography.fontFamilies.regular,
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text,
  },
  chipTextSelected: {
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamilies.semiBold,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.secondaryText,
  },
  listContentContainer: { padding: theme.spacing.sm },
  itemContainer: {
    flex: 1/3, // For 3 columns
    margin: theme.spacing.xs,
    backgroundColor: theme.colors.white,
    borderRadius: theme.spacing.xs,
    overflow: 'hidden',
    alignItems: 'center', // Center content
    padding: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  itemImage: {
    width: '100%',
    aspectRatio: 1, // Square images
    backgroundColor: theme.colors.lightGray,
    borderRadius: theme.spacing.xs, // Match container
    marginBottom: theme.spacing.xs,
  },
  itemCategory: {
    fontSize: theme.typography.fontSizes.xs,
    fontFamily: theme.typography.fontFamilies.regular,
    color: theme.colors.text,
    textAlign: 'center',
  },
});

export default ItemPickerModal;
