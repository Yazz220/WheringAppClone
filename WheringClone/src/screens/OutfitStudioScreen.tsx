import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ScrollView
} from 'react-native';
import theme from '../styles/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ItemPickerModal from '../components/ItemPickerModal'; // Import the modal
import { Item } from './WardrobeScreen'; // Import the Item type

// Define how an item will be represented on the canvas, including position
interface CanvasItem extends Item {
  x: number;
  y: number;
  scale: number;
  zIndex: number;
}

const OutfitStudioScreen: React.FC = () => {
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
  const [isItemPickerVisible, setIsItemPickerVisible] = useState(false);

  const handleAddItemToCanvas = () => {
    setIsItemPickerVisible(true); // Open the item picker modal
  };

  const onItemSelectedFromPicker = (item: Item) => {
    setIsItemPickerVisible(false); // Close the modal
    // Add the selected item to the canvas
    // For now, add with default position/scale, and ensure unique IDs if item can be added multiple times
    // A more robust solution would generate unique IDs for each instance on the canvas.
    const newCanvasItem: CanvasItem = {
      ...item,
      // Use a unique key for items on canvas if the same item can be added multiple times.
      // For now, we assume item.id is unique enough if items can only be on canvas once.
      // Or generate a new ID: id: `${item.id}-${Date.now()}` 
      x: 50, // Default position, to be made draggable
      y: 50,
      scale: 1,
      zIndex: canvasItems.length, // Simple z-ordering
    };
    setCanvasItems(prevItems => [...prevItems, newCanvasItem]);
    console.log('Added item to canvas (placeholder):', newCanvasItem.id);
  };

  const handleSaveOutfit = () => {
    if (canvasItems.length === 0) {
      Alert.alert("Empty Canvas", "Add some items to create an outfit before saving.");
      return;
    }
    // TODO: Implement save outfit logic (capture item IDs, positions, save to Firestore)
    console.log('Saving outfit with items:', canvasItems.map(ci => ({id: ci.id, x: ci.x, y: ci.y})) );
    Alert.alert("TODO", "Save outfit to Firestore (item IDs and their positions).");
  };

  const handleClearCanvas = () => {
    setCanvasItems([]);
    Alert.alert("Canvas Cleared", "All items removed from the canvas.");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Outfit Studio</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={handleClearCanvas} disabled={canvasItems.length === 0}>
            <Icon name="refresh" size={24} color={canvasItems.length === 0 ? theme.colors.disabled : theme.colors.text} />
            <Text style={[styles.headerButtonText, canvasItems.length === 0 && {color: theme.colors.disabled} ]}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleSaveOutfit} disabled={canvasItems.length === 0}>
            <Icon name="check-circle-outline" size={24} color={canvasItems.length === 0 ? theme.colors.disabled : theme.colors.primary} />
            <Text style={[styles.headerButtonText, { color: canvasItems.length === 0 ? theme.colors.disabled : theme.colors.primary }]}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.canvasContainer}>
        <ScrollView contentContainerStyle={styles.canvas}>
          {canvasItems.length === 0 ? (
            <Text style={styles.canvasPlaceholderText}>Your Outfit Canvas is Empty</Text>
          ) : (
            canvasItems.map((item) => (
              // Placeholder for draggable item rendering
              <View key={item.id} style={[styles.canvasItem, { top: item.y, left: item.x, zIndex: item.zIndex }]}>
                <Image source={{ uri: item.processedImageUrl || item.originalImageUrl }} style={styles.canvasItemImage} resizeMode="contain"/>
                {/* <Text style={styles.canvasItemText}>{item.category}</Text> */}
              </View>
            ))
          )}
        </ScrollView>
      </View>

      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.addItemButton} onPress={handleAddItemToCanvas}>
          <Icon name="plus-circle" size={28} color={theme.colors.white} />
          <Text style={styles.addItemButtonText}>Add Item from Wardrobe</Text>
        </TouchableOpacity>
      </View>

      <ItemPickerModal 
        isVisible={isItemPickerVisible} 
        onClose={() => setIsItemPickerVisible(false)}
        onSelectItem={onItemSelectedFromPicker}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
  },
  title: { fontSize: theme.typography.fontSizes.lg, fontFamily: theme.typography.fontFamilies.bold, color: theme.colors.text },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    position: 'absolute',
    top: theme.spacing.sm,
    left: theme.spacing.md,
    right: theme.spacing.md,
    alignItems: 'center',
  },
  headerButton: { padding: theme.spacing.sm, flexDirection: 'row', alignItems: 'center' },
  headerButtonText: { fontSize: theme.typography.fontSizes.md, fontFamily: theme.typography.fontFamilies.semiBold, color: theme.colors.text, marginLeft: theme.spacing.xs },
  canvasContainer: {
    flex: 1,
    backgroundColor: theme.colors.lightGray,
    margin: theme.spacing.md,
    borderRadius: theme.spacing.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
    position: 'relative', // Needed for absolute positioning of canvas items
  },
  canvas: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' }, // This styling might need to change for draggable items
  canvasPlaceholderText: { fontSize: theme.typography.fontSizes.md, color: theme.colors.secondaryText, fontFamily: theme.typography.fontFamilies.regular },
  canvasItem: {
    position: 'absolute', // Items will be positioned absolutely
    padding: theme.spacing.xs,
    // backgroundColor: 'rgba(255,255,255,0.7)',
    // borderRadius: theme.spacing.xs,
    // borderWidth: 1,
    // borderColor: theme.colors.primary,
    alignItems: 'center',
  },
  canvasItemImage: {
    width: 100, // Example size, will need to be dynamic/resizable
    height: 100,
  },
  // canvasItemText: { fontSize: theme.typography.fontSizes.xs, marginTop: theme.spacing.xs },
  actionBar: { padding: theme.spacing.md, borderTopWidth: 1, borderTopColor: theme.colors.border, backgroundColor: theme.colors.white },
  addItemButton: { backgroundColor: theme.colors.primary, paddingVertical: theme.spacing.md, borderRadius: 30, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  addItemButtonText: { color: theme.colors.white, fontSize: theme.typography.fontSizes.md, fontFamily: theme.typography.fontFamilies.bold, marginLeft: theme.spacing.sm },
});

export default OutfitStudioScreen;
