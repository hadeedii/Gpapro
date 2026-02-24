/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 */

import { Platform } from 'react-native';

const tintColorLight = '#6366f1'; // Modern Indigo
const tintColorDark = '#818cf8';

export const Colors = {
  light: {
    text: '#1A202C', // Deep Black
    background: '#F7FAFC', // Very light grey-blue background
    tint: '#3182CE', // Professional Blue
    tabIconDefault: '#A0AEC0',
    tabIconSelected: '#1A202C',
    primary: '#1A202C',
    primaryBlue: '#3182CE',
    accentBlue: '#4299E1',
    secondary: '#718096', // Mid Grey
    surface: 'rgba(255, 255, 255, 0.7)', // Glass surface base
    card: 'rgba(255, 255, 255, 0.7)',
    border: 'rgba(255, 255, 255, 0.4)', // Glass border base
    muted: '#718096',
    success: '#38A169',
    error: '#E53E3E',
    // Glassmorphism specific
    glassBackground: 'rgba(255, 255, 255, 0.5)',
    glassBorder: 'rgba(255, 255, 255, 0.6)',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
  },
  dark: {
    // Making dark theme identical to light but with slightly more contrast for glass
    text: '#1A202C',
    background: '#F7FAFC',
    tint: '#3182CE',
    tabIconDefault: '#A0AEC0',
    tabIconSelected: '#1A202C',
    primary: '#1A202C',
    primaryBlue: '#3182CE',
    accentBlue: '#4299E1',
    secondary: '#718096',
    surface: 'rgba(255, 255, 255, 0.7)',
    card: 'rgba(255, 255, 255, 0.7)',
    border: 'rgba(255, 255, 255, 0.4)',
    muted: '#718096',
    success: '#38A169',
    error: '#E53E3E',
    // Glassmorphism specific
    glassBackground: 'rgba(255, 255, 255, 0.5)',
    glassBorder: 'rgba(255, 255, 255, 0.6)',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 20,
  lg: 28,
  xl: 36,
  full: 999,
};

// Standard shadows for fallback or non-neumorphic parts
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 12,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    rounded: 'ui-rounded',
  },
  default: {
    sans: 'normal',
    rounded: 'normal',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
  },
});
