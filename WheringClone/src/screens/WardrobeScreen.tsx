import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, Image, TouchableOpacity,
  ActivityIndicator, SafeAreaView, RefreshControl, ScrollView, TextInput
} from 'react-native';
import theme from '../styles/theme';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Assuming ItemDetailsScreen will be part of a stack with WardrobeScreen
// This would be defined in that stack navigator, e.g., WardrobeStackParamList
export type WardrobeStackParamList = {
  WardrobeHome: undefined; // Name for the WardrobeScreen itself within the stack
  ItemDetails: { itemId: string };
};

type WardrobeScreenNavigationProp = StackNavigationProp<WardrobeStackParamList, 'WardrobeHome'>;

export interface Item {
  id: string; 
  userId: string;
  originalImageUrl: string;
  processedImageUrl?: string | null;
  category: string;
  brand?: string;
  color?: string;
  size?: string;
  price?: number | null;
  tags?: string[];
  notes?: string;
  status: 'pending_processing' | 'processed' | 'error_processing';
  createdAt: firestore.Timestamp;
  updatedAt: firestore.Timestamp;
}

const CATEGORIES = [
  'All', 'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories', 'Bags', 'Jewelry', 'Sportswear'
  // Add more or fetch dynamically if needed
];

const WardrobeScreen: React.FC = () => {
  const navigation = useNavigation<WardrobeScreenNavigationProp>();
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchItems = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    const currentUser = auth().currentUser;
    if (!currentUser) {
      if (!isRefresh) setLoading(false);
      setAllItems([]);
      setFilteredItems([]);
      if (isRefresh) setRefreshing(false);
      return;
    }

    try {
      const snapshot = await firestore()
        .collection('items')
        .where('userId', '==', currentUser.uid)
        .orderBy('createdAt', 'desc')
        .get();
      
      const userItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Item, 'id'>),
      }));
      setAllItems(userItems);
    } catch (error) {
      console.error("Error fetching wardrobe items: ", error);
    }
    if (!isRefresh) setLoading(false);
    if (isRefresh) setRefreshing(false);
  }, []);

  useEffect(() => {
    let itemsToDisplay = allItems;

    if (selectedCategory !== 'All') {
      itemsToDisplay = itemsToDisplay.filter(item => 
        item.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      itemsToDisplay = itemsToDisplay.filter(item => 
        item.category.toLowerCase().includes(lowerSearchTerm) ||
        (item.brand && item.brand.toLowerCase().includes(lowerSearchTerm)) ||
        (item.color && item.color.toLowerCase().includes(lowerSearchTerm)) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm)))
      );
    }
    setFilteredItems(itemsToDisplay);
  }, [allItems, selectedCategory, searchTerm]);

  useFocusEffect(
    useCallback(() => {
      fetchItems();
    }, [fetchItems])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setSearchTerm(''); // Reset search on refresh
    setSelectedCategory('All'); // Reset category on refresh
    fetchItems(true);
  }, [fetchItems]);

  const handleItemPress = (item: Item) => {
    navigation.navigate('ItemDetails', { itemId: item.id });
  };

  const renderItem = ({ item }: { item: Item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => handleItemPress(item)}>
      <Image 
        source={{ uri: item.processedImageUrl || item.originalImageUrl }}
        style={styles.itemImage}
        resizeMode="cover"
      />
      <View style={styles.itemInfoContainer}>
        <Text style={styles.itemCategory} numberOfLines={1}>{item.category}</Text>
        {item.brand && <Text style={styles.itemBrand} numberOfLines={1}>{item.brand}</Text>}
      </View>
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

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text>Loading your wardrobe...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaFull}>
      <View style={styles.headerContainer}>
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={20} color={theme.colors.secondaryText} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search wardrobe (e.g., brand, color, tag)"
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

      {filteredItems.length === 0 && !loading ? (
          <View style={styles.centerContainerFlex1}>
             <Text style={styles.emptyText}>
                {allItems.length === 0 ? "Your wardrobe is empty!" : "No items match your filters."}
            </Text>
            <Text style={styles.emptySubText}>
                {allItems.length === 0 ? "Tap the '+' button to add your first item." : "Try adjusting your search or category."}
            </Text>
          </View>
      ) : (
        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContentContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]}/>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaFull: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centerContainer: {
    flex: 1, // Changed to flex 1 to take available space if used for empty state that is not full screen
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  centerContainerFlex1: { // Specifically for full screen empty/loading states
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  emptyText: {
    fontSize: theme.typography.fontSizes.lg,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptySubText: {
    fontSize: theme.typography.fontSizes.md,
    fontFamily: theme.typography.fontFamilies.regular,
    color: theme.colors.secondaryText,
    textAlign: 'center',
  },
  headerContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm, // paddingTop for overall header area
    backgroundColor: theme.colors.white, // Or theme.colors.lightGray
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.lightGray,
    borderRadius: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    height: 40,
    marginBottom: theme.spacing.sm, // Space between search and chips
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.typography.fontSizes.sm,
    fontFamily: theme.typography.fontFamilies.regular,
    color: theme.colors.text,
  },
  clearSearchButton: {
    padding: theme.spacing.xs,
  },
  chipsContainer: {
    paddingVertical: theme.spacing.sm,
  },
  chip: {
    backgroundColor: theme.colors.lightGray,
    borderRadius: 20,
    paddingVertical: theme.spacing.xs + 2, // 6
    paddingHorizontal: theme.spacing.md, // 16
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
  listContentContainer: {
    padding: theme.spacing.sm,
  },
  itemContainer: {
    flex: 1,
    margin: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    borderRadius: theme.spacing.sm,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemImage: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: theme.colors.lightGray,
  },
  itemInfoContainer: {
    padding: theme.spacing.sm,
  },
  itemCategory: {
    fontSize: theme.typography.fontSizes.sm,
    fontFamily: theme.typography.fontFamilies.semiBold,
    color: theme.colors.text,
  },
  itemBrand: {
    fontSize: theme.typography.fontSizes.xs,
    fontFamily: theme.typography.fontFamilies.regular,
    color: theme.colors.secondaryText,
  },
});

export default WardrobeScreen;
