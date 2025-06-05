module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // Other plugins can go here
    'react-native-reanimated/plugin', // This must be the last plugin
  ],
};
