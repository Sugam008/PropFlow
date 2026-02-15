/**
 * Design Tokens for PropFlow
 * Shared across Customer Mobile (React Native) and Valuer Dashboard (Next.js)
 * Brand: Aditya Birla Capital (ABC Red #E31E24)
 */

export const colors = {
  // Brand Colors - ABC Red (Aditya Birla Capital)
  primary: {
    50: '#FFF5F5',
    100: '#FFE5E5',
    200: '#FFCCCC',
    300: '#FFB3B3',
    400: '#FF9999',
    500: '#E31E24', // Main brand color - ABC Red
    600: '#B81B20', // Hover/active states
    700: '#8B0000', // Deep accents
    800: '#5C0000',
    900: '#2E0000',
    950: '#1A0000',
  },
  secondary: {
    50: '#F5F5F5',
    100: '#E5E5E5',
    200: '#CCCCCC',
    300: '#B3B3B3',
    400: '#999999',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
    950: '#0A0A0A',
  },

  // Status Colors - WCAG AA compliant
  success: '#047857',
  successLight: '#D1FAE5',
  warning: '#B45309',
  warningLight: '#FEF3C7',
  error: '#B91C1C',
  errorLight: '#FEE2E2',
  info: '#1D4ED8',
  infoLight: '#DBEAFE',

  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
    950: '#030712',
  },

  // Semantic
  background: '#FFFFFF',
  foreground: '#111827',
  muted: '#F3F4F6',
  mutedForeground: '#6B7280',
  border: '#E5E7EB',
  borderFocused: '#E31E24',
  input: '#FFFFFF',
  ring: '#E31E24',
};

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
};

export const typography = {
  fonts: {
    sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  fontWeights: {
    thin: '100',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    black: '900',
  },
  lineHeights: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
};

export const borderRadius = {
  none: 0,
  sm: 2,
  base: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  full: 9999,
};

// Animation tokens
export const animations = {
  duration: {
    0: 0,
    75: 75,
    100: 100,
    150: 150,
    200: 200,
    300: 300,
    500: 500,
    700: 700,
    1000: 1000,
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    default: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: '300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
};

// Gradient tokens
export const gradients = {
  primary: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
  subtle: `linear-gradient(180deg, ${colors.white} 0%, #FFF5F5 100%)`,
  warm: `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.primary[700]} 100%)`,
  sunrise: `linear-gradient(135deg, ${colors.primary[500]} 0%, #FF6B35 50%, #FFB347 100%)`,
  shimmer: `linear-gradient(90deg, ${colors.gray[100]} 0%, ${colors.gray[50]} 50%, ${colors.gray[100]} 100%)`,
};

export const shadow = {
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  brand: `0 4px 14px 0 ${colors.primary[500]}33`,
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
};

export type Theme = {
  colors: typeof colors;
  spacing: typeof spacing;
  typography: typeof typography;
  borderRadius: typeof borderRadius;
  animations: typeof animations;
  gradients: typeof gradients;
  shadow: typeof shadow;
};

export const theme: Theme = {
  colors,
  spacing,
  typography,
  borderRadius,
  animations,
  gradients,
  shadow,
};
