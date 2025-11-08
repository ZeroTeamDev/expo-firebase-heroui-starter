// Created by Kien AI (leejungkiin@gmail.com)
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'heroui-native';

export interface FormCheckboxOption {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

export interface FormCheckboxProps {
  label?: string;
  helperText?: string;
  error?: string;
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  options: FormCheckboxOption[];
  direction?: 'vertical' | 'horizontal';
  disabled?: boolean;
}

export function FormCheckbox({
  label,
  helperText,
  error,
  value,
  defaultValue = [],
  onChange,
  options,
  direction = 'vertical',
  disabled = false,
}: FormCheckboxProps) {
  const { colors } = useTheme();
  const controlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState<string[]>(defaultValue);
  const selected = controlled ? value ?? [] : internalValue;

  const toggle = (option: FormCheckboxOption) => {
    if (disabled || option.disabled) return;
    const exists = selected.includes(option.value);
    const next = exists
      ? selected.filter((item) => item !== option.value)
      : [...selected, option.value];
    if (!controlled) {
      setInternalValue(next);
    }
    onChange?.(next);
  };

  return (
    <View style={{ marginBottom: 16 }}>
      {label ? (
        <Text style={{ fontSize: 14, fontWeight: '600', color: colors.foreground, marginBottom: 8 }}>{label}</Text>
      ) : null}

      <View
        style={{
          flexDirection: direction === 'horizontal' ? 'row' : 'column',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        {options.map((option) => {
          const isChecked = selected.includes(option.value);
          return (
            <Pressable
              key={option.value}
              onPress={() => toggle(option)}
              style={[
                styles.option,
                {
                  opacity: disabled || option.disabled ? 0.5 : 1,
                  borderColor: isChecked ? colors.accent : colors.border || 'rgba(148,163,184,0.3)',
                  backgroundColor: isChecked ? colors.accent : 'transparent',
                },
              ]}
            >
              <View
                style={[
                  styles.checkbox,
                  {
                    borderColor: isChecked ? colors.accentForeground : colors.border || 'rgba(148,163,184,0.5)',
                    backgroundColor: isChecked ? colors.accentForeground : '#fff',
                  },
                ]}
              >
                {isChecked ? <Text style={{ color: colors.accent, fontWeight: '700' }}>✓</Text> : null}
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: isChecked ? colors.accentForeground : colors.foreground,
                    fontWeight: isChecked ? '600' : '500',
                  }}
                >
                  {option.label}
                </Text>
                {option.description ? (
                  <Text style={{ color: colors.mutedForeground || '#94a3b8', fontSize: 12 }}>
                    {option.description}
                  </Text>
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>

      {error ? (
        <Text style={{ color: colors.danger, fontSize: 12, marginTop: 4 }}>{error}</Text>
      ) : helperText ? (
        <Text style={{ color: colors.mutedForeground || '#94a3b8', fontSize: 12, marginTop: 4 }}>{helperText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  option: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minWidth: 160,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
});


