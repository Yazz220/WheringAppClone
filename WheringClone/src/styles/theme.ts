export const colors = {
  // Primary Background and Neutrals
  white: '#FFFFFF',
  lightGray: '#F5F5F5', // Secondary backgrounds
  mediumGray: '#D7D7D7', // Borders or disabled elements
  gray: '#808080', // Secondary text
  charcoal: '#242424', // Primary text

  // Accent Colors
  mintGreen: '#BCD696', // Primary accent (buttons, highlights)
  lavenderPurple: '#CFA8D8',
  coralPink: '#FF6372',
  lightPink: '#FF95B8',
  skyBlue: '#9FCEE2',
  paleYellow: '#F9EF9C',
  peachOrange: '#F7B662',

  // Semantic names (can be added as needed, mapping to the above)
  primary: '#BCD696', // Example: mintGreen as primary
  background: '#FFFFFF', // Example: white as main background
  text: '#242424', // Example: charcoal as primary text
  secondaryText: '#808080',
  border: '#D7D7D7',
  disabled: '#D7D7D7',
  error: '#FF6372', // Example: coralPink for errors
};

export const typography = {
  fontFamilies: {
    regular: 'OpenSans-Regular', // Assumes font file is named OpenSans-Regular.ttf
    semiBold: 'OpenSans-SemiBold', // Assumes font file is named OpenSans-SemiBold.ttf
    bold: 'OpenSans-Bold', // Assumes font file is named OpenSans-Bold.ttf
    extraBold: 'OpenSans-ExtraBold', // Assumes font file is named OpenSans-ExtraBold.ttf
  },
  fontSizes: {
    xs: 12,
    sm: 14, // Small, potentially for secondary body text
    md: 16, // Medium, potentially for primary body text
    lg: 20, // Large, potentially for headings
    xl: 24, // Extra Large, potentially for main titles or emphasis
    xxl: 32,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    loose: 1.75,
  },
  // Example usage for text styles (can be expanded)
  // body: {
  //   fontFamily: 'OpenSans-Regular',
  //   fontSize: 16,
  // },
  // heading: {
  //   fontFamily: 'OpenSans-Bold',
  //   fontSize: 20,
  // }
};

// Spacing units (can be expanded)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

const theme = {
  colors,
  typography,
  spacing,
};

export default theme;