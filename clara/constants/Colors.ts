export const Colors = {
  light: {
    // Primary brand colors
    primary: '#6366F1', // Indigo
    primaryLight: '#A5B4FC',
    primaryDark: '#4338CA',
    
    // Secondary colors
    secondary: '#10B981', // Emerald
    secondaryLight: '#6EE7B7',
    secondaryDark: '#059669',
    
    // Accent colors
    accent: '#F59E0B', // Amber
    error: '#EF4444', // Red
    warning: '#F59E0B',
    success: '#10B981',
    
    // Background colors
    background: '#FFFFFF',
    backgroundSecondary: '#F8FAFC',
    backgroundTertiary: '#F1F5F9',
    
    // Surface colors
    surface: '#FFFFFF',
    surfaceSecondary: '#F8FAFC',
    
    // Text colors
    text: '#0F172A',
    textSecondary: '#64748B',
    textTertiary: '#94A3B8',
    textInverse: '#FFFFFF',
    
    // Border colors
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    borderFocus: '#6366F1',
    
    // Status colors
    tidyGreen: '#10B981',
    untidyRed: '#EF4444',
    
    // Card shadows
    shadowColor: '#000000',
  },
  dark: {
    // Primary brand colors
    primary: '#818CF8',
    primaryLight: '#C7D2FE',
    primaryDark: '#6366F1',
    
    // Secondary colors
    secondary: '#34D399',
    secondaryLight: '#6EE7B7',
    secondaryDark: '#10B981',
    
    // Accent colors
    accent: '#FBBF24',
    error: '#F87171',
    warning: '#FBBF24',
    success: '#34D399',
    
    // Background colors
    background: '#0F172A',
    backgroundSecondary: '#1E293B',
    backgroundTertiary: '#334155',
    
    // Surface colors
    surface: '#1E293B',
    surfaceSecondary: '#334155',
    
    // Text colors
    text: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textTertiary: '#94A3B8',
    textInverse: '#0F172A',
    
    // Border colors
    border: '#475569',
    borderLight: '#334155',
    borderFocus: '#818CF8',
    
    // Status colors
    tidyGreen: '#34D399',
    untidyRed: '#F87171',
    
    // Card shadows
    shadowColor: '#000000',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Typography = {
  // Font sizes
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  
  // Font weights
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
};
