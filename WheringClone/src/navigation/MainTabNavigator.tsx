import React from 'react';
import { createBottomTabNavigator, BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; 

import WardrobeScreen from '../screens/WardrobeScreen';
import OutfitPlannerScreen from '../screens/OutfitPlannerScreen';
// import AddScreen from '../screens/AddScreen'; // Replaced by AddItemStack
import AddItemStack, { AddItemStackParamList } from './AddItemStack'; // Import the new stack
import DiscoverScreen from '../screens/DiscoverScreen';
import ProfileScreen from '../screens/ProfileScreen';
import theme from '../styles/theme';
import { TouchableOpacity, View, StyleSheet } from 'react-native'; // For custom tab button

export type MainTabParamList = {
  Wardrobe: undefined;
  OutfitPlanner: undefined;
  AddItem: NavigatorScreenParams<AddItemStackParamList>; // Correctly type this for the stack
  Discover: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

// Custom Tab Button for the "Add" action if we want a visually distinct button
const CustomAddButton: React.FC<BottomTabBarButtonProps> = ({ children, onPress }) => (
  <TouchableOpacity
    style={styles.customButtonContainer}
    onPress={onPress}
  >
    <View style={styles.customButtonBackground}>
      {children}
    </View>
  </TouchableOpacity>
);

const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: theme.colors.lightGray },
        headerTitleStyle: { fontFamily: theme.typography.fontFamilies.bold },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.gray,
        tabBarStyle: { backgroundColor: theme.colors.white, height: 60, paddingBottom: 5 },
        tabBarLabelStyle: { fontFamily: theme.typography.fontFamilies.regular, fontSize: theme.typography.fontSizes.xs },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'help-circle'; // Default icon
          let iconSize = size;

          if (route.name === 'Wardrobe') {
            iconName = focused ? 'hanger' : 'hanger';
          } else if (route.name === 'OutfitPlanner') {
            iconName = focused ? 'calendar-month' : 'calendar-month-outline';
          } else if (route.name === 'AddItem') {
            iconName = 'plus-circle'; 
            iconSize = size + 15; // Larger icon for the central Add button
            return <MaterialCommunityIcons name={iconName} size={iconSize} color={theme.colors.primary} />;
          } else if (route.name === 'Discover') {
            iconName = focused ? 'compass' : 'compass-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'account-circle' : 'account-circle-outline';
          }
          return <MaterialCommunityIcons name={iconName} size={iconSize} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Wardrobe" component={WardrobeScreen} />
      <Tab.Screen name="OutfitPlanner" component={OutfitPlannerScreen} options={{ title: 'Planner' }}/>
      <Tab.Screen 
        name="AddItem" // Changed from "Add" to match a potential screen name if not using custom button logic directly
        component={AddItemStack} 
        options={{
          title: 'Add', // Label for the tab
          headerShown: false, // The stack has its own headers
          // Custom button if desired - this example uses a larger icon directly
          // tabBarButton: (props) => (
          //   <CustomAddButton {...props} />
          // ),
        }}
      />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  customButtonContainer: {
    top: -20, // Adjust to elevate the button
    justifyContent: 'center',
    alignItems: 'center',
  },
  customButtonBackground: {
    width: 60, // Size of the button
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary, // Or your desired color
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default MainTabNavigator;
