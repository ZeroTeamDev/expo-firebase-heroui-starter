// Created by Kien AI (leejungkiin@gmail.com)
import React, { useCallback, useEffect, useState } from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from 'heroui-native';

export interface FormTextareaProps extends Omit<TextInputProps, 'multiline'> {
  label?: string;
  helperText?: string;
  error?: string;
  minRows?: number;
  maxRows?: number;
  showCharacterCount?: boolean;
}

const ROW_HEIGHT = 20;

export function FormTextarea({
  label,
  helperText,
  error,
  minRows = 3,
  maxRows = 8,
  showCharacterCount = true,
  maxLength,
  style,
  value,
  onChangeText,
  ...props
}: FormTextareaProps) {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';
  const [height, setHeight] = useState(minRows * ROW_HEIGHT);
  const [internalValue, setInternalValue] = useState(value ?? '');
  const controlled = value !== undefined;

  useEffect(() => {
    if (controlled) {
      setInternalValue(value ?? '');
    }
  }, [controlled, value]);

  const handleChange = useCallback(
    (text: string) => {
      if (!controlled) {
        setInternalValue(text);
      }
      onChangeText?.(text);
    },
    [controlled, onChangeText],
  );

  const handleContentSize = useCallback(
    (event: any) => {
      const contentHeight = event.nativeEvent.contentSize.height;
      const calculatedRows = Math.round(contentHeight / ROW_HEIGHT);
      const boundedRows = Math.max(minRows, Math.min(maxRows, calculatedRows));
      setHeight(boundedRows * ROW_HEIGHT + 8);
    },
    [maxRows, minRows],
  );

  const textValue = controlled ? value ?? '' : internalValue;

  return (
    <View style={{ marginBottom: 16 }}>
      {label ? (
        <Text style={{ fontSize: 14, fontWeight: '600', color: colors.foreground, marginBottom: 8 }}>{label}</Text>
      ) : null}

      <TextInput
        multiline
        textAlignVertical="top"
        value={textValue}
        onChangeText={handleChange}
        onContentSizeChange={handleContentSize}
        style={[
          styles.textarea,
          {
            backgroundColor: colors.card || colors.background,
            color: colors.foreground,
            borderColor: error ? colors.danger : colors.border || colors.muted,
            minHeight: minRows * ROW_HEIGHT + 12,
            height,
          },
          style,
        ]}
        placeholderTextColor={colors.mutedForeground || (isDark ? '#94a3b8' : '#94a3b8')}
        maxLength={maxLength}
        {...props}
      />

      {showCharacterCount && maxLength ? (
        <Text style={{ color: colors.mutedForeground || '#94a3b8', fontSize: 11, textAlign: 'right', marginTop: 4 }}>
          {textValue.length}/{maxLength}
        </Text>
      ) : null}

      {error ? (
        <Text style={{ color: colors.danger, fontSize: 12, marginTop: 4 }}>{error}</Text>
      ) : helperText ? (
        <Text style={{ color: colors.mutedForeground || '#94a3b8', fontSize: 12, marginTop: 4 }}>{helperText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  textarea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    lineHeight: ROW_HEIGHT,
  },
});


