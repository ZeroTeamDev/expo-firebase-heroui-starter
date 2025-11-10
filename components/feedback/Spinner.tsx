// Created by Kien AI (leejungkiin@gmail.com)
import React, { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useTheme } from 'heroui-native';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg';
export type SpinnerVariant = 'accent' | 'contrast' | 'muted';

export interface SpinnerProps {
  size?: SpinnerSize;
  color?: string;
  style?: ViewStyle;
  fullScreen?: boolean;
  overlay?: boolean;
  overlayColor?: string;
  label?: string;
  helperText?: string;
  variant?: SpinnerVariant;
  accessibilityLabel?: string;
}

export function Spinner({
  size = 'md',
  color,
  style,
  fullScreen = false,
  overlay = false,
  overlayColor,
  label,
  helperText,
  variant = 'accent',
  accessibilityLabel = 'Loading',
}: SpinnerProps) {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  const palette = useMemo(() => getVariantPalette(variant, colors, isDark), [variant, colors, isDark]);
  const indicatorColor = color ?? palette.indicator;

  const indicatorProps = getIndicatorProps(size);

  const overlayBackground = overlayColor ?? (isDark ? 'rgba(15,23,42,0.72)' : 'rgba(255,255,255,0.78)');

  const spinnerContent = (
    <View style={styles.content}>
      <ActivityIndicator
        size={indicatorProps.size}
        color={indicatorColor}
        style={indicatorProps.style}
        accessibilityRole="progressbar"
        accessibilityLabel={accessibilityLabel}
      />
      {label ? <Text style={[styles.label, { color: palette.label }]}>{label}</Text> : null}
      {helperText ? <Text style={[styles.helperText, { color: palette.helper }]}>{helperText}</Text> : null}
    </View>
  );

  if (fullScreen || overlay) {
    return (
      <View
        style={[
          fullScreen ? styles.fullScreenOverlay : styles.overlay,
          { backgroundColor: overlayBackground },
          style,
        ]}
      >
        {spinnerContent}
      </View>
    );
  }

  return <View style={[styles.inline, style]}>{spinnerContent}</View>;
}

type ThemeColors = {
  accent: string;
  [key: string]: string;
};

function getVariantPalette(variant: SpinnerVariant, colors: ThemeColors, isDark: boolean) {
  switch (variant) {
    case 'contrast':
      return {
        indicator: isDark ? '#f8fafc' : '#0f172a',
        label: isDark ? '#e2e8f0' : '#0f172a',
        helper: isDark ? '#cbd5f5' : '#475569',
      };
    case 'muted':
      return {
        indicator: isDark ? '#94a3b8' : '#64748b',
        label: isDark ? '#cbd5f5' : '#475569',
        helper: isDark ? '#94a3b8' : '#64748b',
      };
    default:
      return {
        indicator: colors.accent ?? '#4f46e5',
        label: isDark ? '#c7d2fe' : '#312e81',
        helper: isDark ? '#cbd5f5' : '#475569',
      };
  }
}

function getIndicatorProps(size: SpinnerSize) {
  switch (size) {
    case 'xs':
      return { size: 'small' as const, style: { transform: [{ scale: 0.65 }] } };
    case 'sm':
      return { size: 'small' as const, style: { transform: [{ scale: 0.85 }] } };
    case 'lg':
      return { size: 'large' as const, style: { transform: [{ scale: 1.25 }] } };
    default:
      return { size: 'large' as const, style: { transform: [{ scale: 1 }] } };
  }
}

const styles = StyleSheet.create({
  inline: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  helperText: {
    fontSize: 12,
    textAlign: 'center',
  },
  fullScreenOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});



