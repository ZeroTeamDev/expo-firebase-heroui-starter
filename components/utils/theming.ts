/**
 * Theming Utilities
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Shared theming tokens and utilities for consistent styling
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 999,
} as const;

export const fontSize = {
  xs: 11,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  '2xl': 20,
  '3xl': 24,
} as const;

export const fontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
} as const;

export const animationDuration = {
  fast: 150,
  normal: 240,
  slow: 320,
  slower: 480,
} as const;

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
} as const;

export type Spacing = typeof spacing[keyof typeof spacing];
export type BorderRadius = typeof borderRadius[keyof typeof borderRadius];
export type FontSize = typeof fontSize[keyof typeof fontSize];
export type FontWeight = typeof fontWeight[keyof typeof fontWeight];
export type AnimationDuration = typeof animationDuration[keyof typeof animationDuration];
export type ZIndex = typeof zIndex[keyof typeof zIndex];


