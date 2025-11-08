// Created by Kien AI (leejungkiin@gmail.com)
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from 'heroui-native';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger' | 'neutral';

export interface AlertAction {
  label: string;
  onPress: () => void;
  variant?: 'default' | 'outline';
}

export interface AlertProps {
  title: string;
  description?: string;
  variant?: AlertVariant;
  dismissible?: boolean;
  onDismiss?: () => void;
  actions?: AlertAction[];
  icon?: React.ReactNode;
  compact?: boolean;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
}

export function Alert({
  title,
  description,
  variant = 'info',
  dismissible = false,
  onDismiss,
  actions,
  icon,
  compact = false,
  style,
  titleStyle,
  descriptionStyle,
}: AlertProps) {
  const { colors, theme } = useTheme();
  const [visible, setVisible] = useState(true);
  const isDark = theme === 'dark';

  const palette = useMemo(() => getVariantPalette(variant, isDark, colors), [variant, isDark, colors]);

  if (!visible) {
    return null;
  }

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  const containerPadding = compact ? 12 : 16;
  const gap = compact ? 10 : 12;

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: palette.border,
          backgroundColor: palette.background,
          padding: containerPadding,
          gap,
        },
        style,
      ]}
      accessibilityRole="alert"
    >
      <View style={styles.headerRow}>
      <View style={[styles.iconSlot, { backgroundColor: palette.iconBackground }]}>{icon ?? palette.icon}</View>
        <View style={styles.textBlock}>
          <Text style={[styles.title, { color: palette.foreground }, titleStyle]}>{title}</Text>
          {description ? (
            <Text style={[styles.description, { color: palette.description }, descriptionStyle]}>{description}</Text>
          ) : null}
        </View>

        {dismissible ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Dismiss alert"
            onPress={handleDismiss}
            style={[styles.dismissButton, { borderColor: palette.border }]}
          >
            <Text style={{ color: palette.description, fontSize: 12, fontWeight: '600' }}>✕</Text>
          </Pressable>
        ) : null}
      </View>

      {actions && actions.length > 0 ? (
        <View style={[styles.actionsRow, { gap: 8 }]}>
          {actions.map((action) => (
            <Pressable
              key={action.label}
              onPress={action.onPress}
              style={[
                styles.actionButton,
                action.variant === 'outline'
                  ? {
                      backgroundColor: 'transparent',
                      borderColor: palette.border,
                    }
                  : {
                      backgroundColor: palette.foreground,
                      borderColor: palette.foreground,
                    },
              ]}
            >
              <Text
                style={[
                  styles.actionLabel,
                  action.variant === 'outline'
                    ? { color: palette.foreground }
                    : { color: palette.onForeground },
                ]}
              >
                {action.label}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

type ThemeColors = {
  accent: string;
  [key: string]: string;
};

function getVariantPalette(variant: AlertVariant, isDark: boolean, colors: ThemeColors) {
  const iconSize = 18;

  const variants: Record<
    AlertVariant,
    {
      background: string;
      border: string;
      foreground: string;
      onForeground: string;
      description: string;
      iconBackground: string;
      icon: React.ReactNode;
    }
  > = {
    info: {
      background: isDark ? 'rgba(59,130,246,0.16)' : 'rgba(191,219,254,0.4)',
      border: isDark ? 'rgba(59,130,246,0.35)' : 'rgba(59,130,246,0.45)',
      foreground: isDark ? '#bfdbfe' : '#1d4ed8',
      onForeground: '#0f172a',
      description: isDark ? '#e2e8f0' : '#1f2937',
      iconBackground: isDark ? 'rgba(59,130,246,0.35)' : 'rgba(59,130,246,0.2)',
      icon: <Text style={{ color: '#1d4ed8', fontWeight: '700', fontSize: iconSize }}>ℹ︎</Text>,
    },
    success: {
      background: isDark ? 'rgba(34,197,94,0.18)' : 'rgba(187,247,208,0.4)',
      border: isDark ? 'rgba(22,163,74,0.35)' : 'rgba(34,197,94,0.4)',
      foreground: isDark ? '#4ade80' : '#166534',
      onForeground: '#f8fafc',
      description: isDark ? '#f8fafc' : '#0f172a',
      iconBackground: isDark ? 'rgba(34,197,94,0.3)' : 'rgba(34,197,94,0.2)',
      icon: <Text style={{ color: '#15803d', fontWeight: '700', fontSize: iconSize }}>✔︎</Text>,
    },
    warning: {
      background: isDark ? 'rgba(250,204,21,0.2)' : 'rgba(254,240,138,0.45)',
      border: isDark ? 'rgba(202,138,4,0.4)' : 'rgba(217,119,6,0.45)',
      foreground: isDark ? '#facc15' : '#92400e',
      onForeground: '#0f172a',
      description: isDark ? '#fef9c3' : '#1f2937',
      iconBackground: isDark ? 'rgba(202,138,4,0.35)' : 'rgba(234,179,8,0.25)',
      icon: <Text style={{ color: '#b45309', fontWeight: '700', fontSize: iconSize }}>!</Text>,
    },
    danger: {
      background: isDark ? 'rgba(239,68,68,0.2)' : 'rgba(254,202,202,0.45)',
      border: isDark ? 'rgba(220,38,38,0.45)' : 'rgba(220,38,38,0.5)',
      foreground: isDark ? '#fca5a5' : '#7f1d1d',
      onForeground: '#f8fafc',
      description: isDark ? '#f8fafc' : '#0f172a',
      iconBackground: isDark ? 'rgba(248,113,113,0.3)' : 'rgba(239,68,68,0.2)',
      icon: <Text style={{ color: '#b91c1c', fontWeight: '700', fontSize: iconSize }}>!</Text>,
    },
    neutral: {
      background: isDark ? 'rgba(148,163,184,0.22)' : 'rgba(226,232,240,0.55)',
      border: isDark ? 'rgba(148,163,184,0.45)' : 'rgba(148,163,184,0.6)',
      foreground: isDark ? '#f8fafc' : '#111827',
      onForeground: '#0f172a',
      description: isDark ? '#e2e8f0' : '#1f2937',
      iconBackground: isDark ? 'rgba(148,163,184,0.35)' : 'rgba(148,163,184,0.25)',
      icon: <Text style={{ color: colors.accent, fontWeight: '700', fontSize: iconSize }}>✶</Text>,
    },
  };

  return variants[variant];
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconSlot: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  dismissButton: {
    width: 28,
    height: 28,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  actionButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
});


