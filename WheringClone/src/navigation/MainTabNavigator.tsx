import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// Placeholder for icons, we'll use react-native-vector-icons later
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; 

import WardrobeScreen from '../screens/WardrobeScreen';
import OutfitPlannerScreen from '../screens/OutfitPlannerScreen';
import AddScreen from '../screens/AddScreen';
import DiscoverScreen from '../screens/DiscoverScreen';
import ProfileScreen from '../screens/ProfileScreen';
import theme from '../styles/theme';

export type MainTabParamList = {
  Wardrobe: undefined;
  OutfitPlanner: undefined;
  Add: undefined; // This might be a placeholder for a modal action
  Discover: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: theme.colors.lightGray },
        headerTitleStyle: { fontFamily: theme.typography.fontFamilies.bold },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.gray,
        tabBarStyle: { backgroundColor: theme.colors.white },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'help-circle'; // Default icon

          if (route.name === 'Wardrobe') {
            iconName = focused ? 'hanger' : 'hanger';
          } else if (route.name === 'OutfitPlanner') {
            iconName = focused ? 'calendar-month' : 'calendar-month-outline';
          } else if (route.name === 'Add') {
            // Special handling for a central button, often larger or custom
            // For now, a simple icon. This tab might not be a screen but a button.
            iconName = 'plus-circle'; 
            return <MaterialCommunityIcons name={iconName} size={size + 10} color={theme.colors.primary} />;
          } else if (route.name === 'Discover') {
            iconName = focused ? 'compass' : 'compass-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'account-circle' : 'account-circle-outline';
          }
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Wardrobe" component={WardrobeScreen} />
      <Tab.Screen name="OutfitPlanner" component={OutfitPlannerScreen} options={{ title: 'Planner' }}/>
      <Tab.Screen 
        name="Add" 
        component={AddScreen} 
        options={{ title: '' }} // No title for the central button
        // Listeners can be added here if 'Add' should open a modal instead of a screen
        // listeners={({ navigation }) => ({
        //   tabPress: e => {
        //     e.preventDefault();
        //     navigation.navigate('YourAddModalOrFlow'); // Or open a modal
        //   },
        // })}
      />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;