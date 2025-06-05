import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddItemSourceScreen from '../screens/AddItemSourceScreen';
import AddItemDetailsScreen from '../screens/AddItemDetailsScreen';
import theme from '../styles/theme';

export type AddItemStackParamList = {
  AddItemSource: undefined; // Or AddItemSourceScreen
  AddItemDetails: { // Params expected from AddItemSourceScreen
    imageUri?: string; // For local images from camera/library
    imageUrl?: string; // For images from URL
  };
  // Potentially other screens in this flow later
};

const Stack = createNativeStackNavigator<AddItemStackParamList>();

const AddItemStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontFamily: theme.typography.fontFamilies.bold,
        },
        // headerShown: false, // You can choose to hide or style headers
      }}
    >
      <Stack.Screen 
        name="AddItemSource" 
        component={AddItemSourceScreen} 
        options={{ title: 'Add New Item' }} 
      />
      <Stack.Screen 
        name="AddItemDetails" 
        component={AddItemDetailsScreen} 
        options={{ title: 'Item Details' }} 
      />
    </Stack.Navigator>
  );
};

export default AddItemStack;