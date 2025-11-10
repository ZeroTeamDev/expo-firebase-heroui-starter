/**
 * Empty State Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Display empty state with optional action
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from 'heroui-native';

export interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export function EmptyState({
  title = 'No data',
  message,
  icon,
  actionLabel,
  onAction,
  style,
}: EmptyStateProps) {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View style={[styles.container, style]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>{title}</Text>
      {message && (
        <Text style={[styles.message, { color: isDark ? '#999' : '#666' }]}>{message}</Text>
      )}
      {actionLabel && onAction && (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.accent }]}
          onPress={onAction}
        >
          <Text style={[styles.actionText, { color: colors.accentForeground }]}>
            {actionLabel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  actionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

