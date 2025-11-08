// Created by Kien AI (leejungkiin@gmail.com)
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'heroui-native';

export interface FormSwitchProps {
  label?: string;
  description?: string;
  helperText?: string;
  error?: string;
  value?: boolean;
  defaultValue?: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
}

export function FormSwitch({
  label,
  description,
  helperText,
  error,
  value,
  defaultValue = false,
  onChange,
  disabled = false,
}: FormSwitchProps) {
  const { colors } = useTheme();
  const controlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const toggled = controlled ? value ?? false : internalValue;

  const toggle = () => {
    if (disabled) return;
    if (!controlled) {
      setInternalValue((prev) => !prev);
    }
    onChange?.(!toggled);
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <Pressable
        style={styles.row}
        onPress={toggle}
        accessibilityRole="switch"
        accessibilityState={{ checked: toggled, disabled }}
        disabled={disabled}
      >
        <View style={styles.textBlock}>
          {label ? (
            <Text style={{ color: colors.foreground, fontWeight: '600', fontSize: 15 }}>{label}</Text>
          ) : null}
          {description ? (
            <Text style={{ color: colors.mutedForeground || '#94a3b8', fontSize: 13 }}>{description}</Text>
          ) : null}
        </View>
        <View
          style={[
            styles.switch,
            {
              backgroundColor: toggled ? colors.accent : colors.muted || 'rgba(148,163,184,0.4)',
              opacity: disabled ? 0.6 : 1,
            },
          ]}
        >
          <View
            style={[
              styles.thumb,
              {
                transform: [{ translateX: toggled ? 18 : 0 }],
                backgroundColor: toggled ? colors.accentForeground : '#fff',
              },
            ]}
          />
        </View>
      </Pressable>

      {error ? (
        <Text style={{ color: colors.danger, fontSize: 12, marginTop: 4 }}>{error}</Text>
      ) : helperText ? (
        <Text style={{ color: colors.mutedForeground || '#94a3b8', fontSize: 12, marginTop: 4 }}>{helperText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  switch: {
    width: 46,
    height: 26,
    borderRadius: 999,
    padding: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 999,
    backgroundColor: '#fff',
  },
});


