/**
 * Error State Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Display error state with retry option
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from 'heroui-native';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  error?: Error | string;
  retryLabel?: string;
  onRetry?: () => void;
  style?: ViewStyle;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  error,
  retryLabel = 'Retry',
  onRetry,
  style,
}: ErrorStateProps) {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';
  const errorMessage = error instanceof Error ? error.message : error || message;

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>{title}</Text>
      {errorMessage && (
        <Text style={[styles.message, { color: isDark ? '#999' : '#666' }]}>
          {errorMessage}
        </Text>
      )}
      {onRetry && (
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.danger }]}
          onPress={onRetry}
        >
          <Text style={[styles.retryText, { color: colors.dangerForeground }]}>
            {retryLabel}
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
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

