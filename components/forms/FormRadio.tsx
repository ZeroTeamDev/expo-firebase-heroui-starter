// Created by Kien AI (leejungkiin@gmail.com)
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'heroui-native';

export interface FormRadioOption {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

export interface FormRadioProps {
  label?: string;
  helperText?: string;
  error?: string;
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string) => void;
  options: FormRadioOption[];
  disabled?: boolean;
  direction?: 'vertical' | 'horizontal';
}

export function FormRadio({
  label,
  helperText,
  error,
  value,
  defaultValue = null,
  onChange,
  options,
  disabled = false,
  direction = 'vertical',
}: FormRadioProps) {
  const { colors } = useTheme();
  const controlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState<string | null>(defaultValue);
  const selected = controlled ? value ?? null : internalValue;

  const select = (option: FormRadioOption) => {
    if (disabled || option.disabled) return;
    if (!controlled) {
      setInternalValue(option.value);
    }
    onChange?.(option.value);
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
          const isChecked = selected === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => select(option)}
              style={[
                styles.option,
                {
                  opacity: disabled || option.disabled ? 0.5 : 1,
                  borderColor: isChecked ? colors.accent : colors.border || 'rgba(148,163,184,0.3)',
                  backgroundColor: isChecked ? colors.accent : 'transparent',
                },
              ]}
            >
              <View style={styles.radioOuter}>
                <View
                  style={[
                    styles.radioInner,
                    {
                      backgroundColor: isChecked ? colors.accentForeground : 'transparent',
                      borderColor: isChecked ? colors.accentForeground : colors.border || 'rgba(148,163,184,0.4)',
                    },
                  ]}
                />
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
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 999,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 999,
    borderWidth: 0.5,
  },
});


