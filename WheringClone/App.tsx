import React from 'react';
// It's good practice to ensure gesture handler is at the top for navigators
import 'react-native-gesture-handler'; 
import AppNavigator from './src/navigation/AppNavigator';

// react-native-screens is a dependency of React Navigation
// and should be enabled for optimal performance.
import { enableScreens } from 'react-native-screens';
enableScreens();

const App: React.FC = () => {
  return <AppNavigator />;
};

export default App;
