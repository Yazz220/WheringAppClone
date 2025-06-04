import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '../styles/theme'; // Assuming theme file is one level up in styles

const WelcomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  text: {
    fontSize: theme.typography.fontSizes.lg,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.text,
  },
});

export default WelcomeScreen;