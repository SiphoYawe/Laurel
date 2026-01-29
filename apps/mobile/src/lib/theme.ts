/**
 * Laurel Mobile Theme
 * Shared colors and design tokens matching the web app
 */

export const colors = {
  // Brand colors
  laurel: {
    forest: "#2D5A3D",
    sage: "#7CB07F",
    amber: "#E8A54B",
    white: "#FAFAF8",
    charcoal: "#1A1A1A",
    surface: "#F5F5F3",
    forestDark: "#1A3D26",
    forestLight: "#3D7A4D",
  },

  // Gray scale
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },

  // Semantic colors
  success: {
    light: "#D1FAE5",
    DEFAULT: "#10B981",
    dark: "#047857",
  },

  warning: {
    light: "#FEF3C7",
    DEFAULT: "#F59E0B",
    dark: "#B45309",
  },

  error: {
    light: "#FEE2E2",
    DEFAULT: "#EF4444",
    dark: "#B91C1C",
  },

  // UI colors
  background: "#FFFFFF",
  foreground: "#1A1A1A",
  muted: "#F3F4F6",
  mutedForeground: "#6B7280",
  border: "#E5E7EB",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const fontSize = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 28,
  "4xl": 32,
};

export const fontWeight = {
  normal: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
};

export const shadow = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
};
