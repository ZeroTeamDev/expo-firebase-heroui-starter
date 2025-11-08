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
  leadingAdornment?: React.ReactNode;
  trailingAdornment?: React.ReactNode;
  showCharacterCount?: boolean;
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
  leadingAdornment,
  trailingAdornment,
  showCharacterCount = false,
  style,
  ...props
}: FormInputProps) {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';
  const maxLength = props.maxLength;
  const [valueLength, setValueLength] = React.useState(props.value ? String(props.value).length : 0);

  React.useEffect(() => {
    if (props.value !== undefined) {
      setValueLength(String(props.value ?? '').length);
    }
  }, [props.value]);

  const handleChangeText = (text: string) => {
    setValueLength(text.length);
    props.onChangeText?.(text);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: colors.foreground }, labelStyle]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: colors.card || colors.background,
            borderColor: error ? colors.danger : colors.border || colors.muted,
          },
        ]}
      >
        {leadingAdornment ? <View style={styles.leading}>{leadingAdornment}</View> : null}
        <TextInput
          style={[
            styles.input,
            {
              color: colors.foreground,
            },
            inputStyle,
            style,
          ]}
          placeholderTextColor={colors.mutedForeground || (isDark ? '#666' : '#999')}
          {...props}
          onChangeText={handleChangeText}
        />
        {trailingAdornment ? <View style={styles.trailing}>{trailingAdornment}</View> : null}
      </View>
      {error && (
        <Text style={[styles.error, { color: colors.danger }, errorStyle]}>{error}</Text>
      )}
      {helperText && !error && (
        <Text style={[styles.helper, { color: colors.mutedForeground || (isDark ? '#999' : '#666') }, helperStyle]}>
          {helperText}
        </Text>
      )}
      {showCharacterCount && maxLength ? (
        <Text
          style={{
            color: colors.mutedForeground || (isDark ? '#94a3b8' : '#64748b'),
            fontSize: 11,
            textAlign: 'right',
            marginTop: 4,
          }}
        >
          {valueLength}/{maxLength}
        </Text>
      ) : null}
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
  inputWrapper: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leading: {
    marginRight: 10,
  },
  trailing: {
    marginLeft: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
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

