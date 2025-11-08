// Created by Kien AI (leejungkiin@gmail.com)
import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from 'heroui-native';

export type BadgeVariant = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  leadingDot?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  maxLabelLength?: number;
}

export function Badge({
  label,
  variant = 'neutral',
  size = 'md',
  icon,
  leadingDot = false,
  onPress,
  disabled = false,
  style,
  labelStyle,
  maxLabelLength,
}: BadgeProps) {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';
  const Container = onPress ? Pressable : View;

  const palette = getVariantPalette(variant, colors, isDark);
  const { paddingHorizontal, paddingVertical, fontSize } = size === 'sm' ? sizeSmall : sizeMedium;

  const shouldTruncate = typeof maxLabelLength === 'number' && maxLabelLength > 0 && label.length > maxLabelLength;
  const finalLabel = shouldTruncate ? `${label.slice(0, maxLabelLength)}…` : label;

  return (
    <Container
      accessibilityRole={onPress ? 'button' : 'text'}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={[
        styles.base,
        {
          paddingHorizontal,
          paddingVertical,
          backgroundColor: palette.background,
          borderColor: palette.border,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      <View style={styles.content}>
        {leadingDot ? <View style={[styles.dot, { backgroundColor: palette.indicator }]} /> : null}
        {icon ? <View style={[styles.icon, { color: palette.foreground }]}>{icon}</View> : null}
        <Text
          style={[styles.label, { color: palette.foreground, fontSize }, labelStyle]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {finalLabel}
        </Text>
      </View>
    </Container>
  );
}

const sizeSmall = {
  paddingHorizontal: 8,
  paddingVertical: 4,
  fontSize: 11,
} as const;

const sizeMedium = {
  paddingHorizontal: 10,
  paddingVertical: 6,
  fontSize: 12,
} as const;

type ThemeColors = {
  accent: string;
  [key: string]: string;
};

function getVariantPalette(variant: BadgeVariant, colors: ThemeColors, isDark: boolean) {
  const accentBg = isDark ? 'rgba(99,102,241,0.22)' : 'rgba(79,70,229,0.12)';
  const accentFg = isDark ? '#c7d2fe' : '#3730a3';
  const accentBorder = isDark ? 'rgba(79,70,229,0.4)' : 'rgba(79,70,229,0.25)';

  const palettes: Record<BadgeVariant, { background: string; foreground: string; border: string; indicator: string }> = {
    neutral: {
      background: isDark ? 'rgba(148,163,184,0.2)' : 'rgba(148,163,184,0.16)',
      foreground: isDark ? '#e2e8f0' : '#1f2937',
      border: 'transparent',
      indicator: colors.accent,
    },
    accent: {
      background: accentBg,
      foreground: accentFg,
      border: accentBorder,
      indicator: '#6366f1',
    },
    success: {
      background: isDark ? 'rgba(34,197,94,0.22)' : 'rgba(34,197,94,0.16)',
      foreground: isDark ? '#bbf7d0' : '#166534',
      border: isDark ? 'rgba(22,163,74,0.35)' : 'rgba(22,163,74,0.2)',
      indicator: '#16a34a',
    },
    warning: {
      background: isDark ? 'rgba(250,204,21,0.24)' : 'rgba(250,204,21,0.2)',
      foreground: isDark ? '#fef08a' : '#92400e',
      border: isDark ? 'rgba(202,138,4,0.35)' : 'rgba(202,138,4,0.28)',
      indicator: '#ca8a04',
    },
    danger: {
      background: isDark ? 'rgba(248,113,113,0.24)' : 'rgba(248,113,113,0.2)',
      foreground: isDark ? '#fecaca' : '#7f1d1d',
      border: isDark ? 'rgba(220,38,38,0.35)' : 'rgba(220,38,38,0.28)',
      indicator: '#dc2626',
    },
    info: {
      background: isDark ? 'rgba(59,130,246,0.24)' : 'rgba(59,130,246,0.2)',
      foreground: isDark ? '#bfdbfe' : '#1d4ed8',
      border: isDark ? 'rgba(37,99,235,0.35)' : 'rgba(37,99,235,0.25)',
      indicator: '#2563eb',
    },
    outline: {
      background: 'transparent',
      foreground: isDark ? '#f8fafc' : '#1f2937',
      border: isDark ? 'rgba(148,163,184,0.4)' : 'rgba(148,163,184,0.5)',
      indicator: colors.accent,
    },
  };

  return palettes[variant];
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 999,
    borderWidth: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  icon: {
    marginRight: -2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 999,
  },
  label: {
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});


