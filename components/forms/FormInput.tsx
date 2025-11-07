/**
 * Form Input Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Enhanced input with validation and error display
 */

import React from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from 'heroui-native';

export interface FormInputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  helperStyle?: TextStyle;
}

export function FormInput({
  label,
  error,
  helperText,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  helperStyle,
  style,
  ...props
}: FormInputProps) {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: colors.foreground }, labelStyle]}>
          {label}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card || colors.background,
            color: colors.foreground,
            borderColor: error ? colors.danger : colors.border || colors.muted,
          },
          inputStyle,
          style,
        ]}
        placeholderTextColor={colors.mutedForeground || (isDark ? '#666' : '#999')}
        {...props}
      />
      {error && (
        <Text style={[styles.error, { color: colors.danger }, errorStyle]}>{error}</Text>
      )}
      {helperText && !error && (
        <Text style={[styles.helper, { color: colors.mutedForeground || (isDark ? '#999' : '#666') }, helperStyle]}>
          {helperText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
  helper: {
    fontSize: 12,
    marginTop: 4,
  },
});

