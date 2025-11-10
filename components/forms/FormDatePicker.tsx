// Created by Kien AI (leejungkiin@gmail.com)
import React, { useCallback, useMemo, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerAndroid,
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useTheme } from 'heroui-native';

type PickerMode = 'date' | 'time' | 'datetime';

export interface DateRangeValue {
  start: Date | null;
  end: Date | null;
}

export interface FormDatePickerProps {
  label?: string;
  helperText?: string;
  error?: string;
  mode?: PickerMode;
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (value: Date | null) => void;
  range?: boolean;
  rangeValue?: DateRangeValue;
  defaultRangeValue?: DateRangeValue;
  onRangeChange?: (value: DateRangeValue) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  placeholder?: string;
  disabled?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
}

type Target = 'single' | 'start' | 'end';

export function FormDatePicker({
  label,
  helperText,
  error,
  mode = 'date',
  value,
  defaultValue = null,
  onChange,
  range = false,
  rangeValue,
  defaultRangeValue = { start: null, end: null },
  onRangeChange,
  minimumDate,
  maximumDate,
  placeholder = 'Select date',
  disabled = false,
  confirmLabel = 'Done',
  cancelLabel = 'Cancel',
}: FormDatePickerProps) {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  const controlled = value !== undefined;
  const rangeControlled = rangeValue !== undefined;

  const [internalValue, setInternalValue] = useState<Date | null>(defaultValue);
  const [internalRange, setInternalRange] = useState<DateRangeValue>(defaultRangeValue);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<Target>('single');
  const [tempPickerValue, setTempPickerValue] = useState<Date>(new Date());

  const selectedValue = controlled ? value ?? null : internalValue;
  const selectedRange = range
    ? rangeControlled
      ? rangeValue ?? defaultRangeValue
      : internalRange
    : undefined;

  const formatDate = useCallback(
    (date: Date | null | undefined) => {
      if (!date) return placeholder;
      try {
        const options: Intl.DateTimeFormatOptions =
          mode === 'time'
            ? { hour: '2-digit', minute: '2-digit' }
            : mode === 'datetime'
            ? { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
            : { year: 'numeric', month: 'short', day: 'numeric' };
        return new Intl.DateTimeFormat(undefined, options).format(date);
      } catch {
        return date.toLocaleString();
      }
    },
    [mode, placeholder],
  );

  const singleLabel = useMemo(() => formatDate(selectedValue ?? null), [formatDate, selectedValue]);
  const rangeStartLabel = useMemo(
    () => formatDate(selectedRange?.start ?? null),
    [formatDate, selectedRange?.start],
  );
  const rangeEndLabel = useMemo(
    () => formatDate(selectedRange?.end ?? null),
    [formatDate, selectedRange?.end],
  );

  const updateValue = useCallback(
    (next: Date | null) => {
      if (!controlled) {
        setInternalValue(next);
      }
      onChange?.(next);
    },
    [controlled, onChange],
  );

  const updateRange = useCallback(
    (next: DateRangeValue) => {
      if (!rangeControlled) {
        setInternalRange(next);
      }
      onRangeChange?.(next);
    },
    [onRangeChange, rangeControlled],
  );

  const handleConfirm = useCallback(
    (target: Target, nextDate: Date) => {
      if (!range) {
        if (mode === 'datetime' && Platform.OS === 'android') {
          // additional time selection handled via Android combined flow
        }
        updateValue(nextDate);
        setPickerVisible(false);
        return;
      }

      const next = { ...(selectedRange ?? { start: null, end: null }) };
      if (target === 'start') {
        next.start = nextDate;
        if (next.end && next.end < nextDate) {
          next.end = nextDate;
        }
      } else {
        next.end = nextDate;
        if (next.start && nextDate < next.start) {
          next.start = nextDate;
        }
      }
      updateRange(next);
    },
    [range, selectedRange, updateRange, updateValue, mode],
  );

  const openIOSPicker = useCallback(
    (target: Target) => {
      setPickerTarget(target);
      // Set initial temp value based on current selection
      const baseDate =
        target === 'start'
          ? selectedRange?.start ?? new Date()
          : target === 'end'
          ? selectedRange?.end ?? new Date()
          : selectedValue ?? new Date();
      setTempPickerValue(baseDate);
      setPickerVisible(true);
    },
    [selectedRange, selectedValue],
  );

  const handleAndroidPicker = useCallback(
    (target: Target) => {
      const baseDate =
        target === 'start'
          ? selectedRange?.start ?? new Date()
          : target === 'end'
          ? selectedRange?.end ?? new Date()
          : selectedValue ?? new Date();

      const openMode = mode === 'datetime' ? 'date' : mode;

      DateTimePickerAndroid.open({
        value: baseDate,
        mode: openMode,
        is24Hour: true,
        minimumDate,
        maximumDate,
        onChange: (_event: DateTimePickerEvent, date?: Date) => {
          if (!date) return;
          if (mode === 'datetime') {
            DateTimePickerAndroid.open({
              value: date,
              mode: 'time',
              is24Hour: true,
              onChange: (_event2, timeDate) => {
                if (!timeDate) return;
                const combined = new Date(date);
                combined.setHours(timeDate.getHours(), timeDate.getMinutes(), 0, 0);
                handleConfirm(target, combined);
              },
            });
          } else {
            handleConfirm(target, date);
          }
        },
      });
    },
    [handleConfirm, maximumDate, minimumDate, mode, selectedRange, selectedValue],
  );

  const openPicker = useCallback(
    (target: Target) => {
      if (disabled) return;
      if (Platform.OS === 'android') {
        handleAndroidPicker(target);
      } else if (Platform.OS === 'web') {
        // Fallback to browser inputs
        const input = document.createElement('input');
        input.type = mode === 'time' ? 'time' : mode === 'datetime' ? 'datetime-local' : 'date';
        const baseDate =
          target === 'start'
            ? selectedRange?.start ?? new Date()
            : target === 'end'
            ? selectedRange?.end ?? new Date()
            : selectedValue ?? new Date();
        input.value = baseDate
          .toISOString()
          .slice(0, mode === 'time' ? 5 : mode === 'datetime' ? 16 : 10);
        input.onchange = () => {
          if (!input.value) return;
          const parsed = new Date(input.value);
          handleConfirm(target, parsed);
        };
        input.click();
      } else {
        openIOSPicker(target);
      }
    },
    [disabled, handleAndroidPicker, handleConfirm, mode, openIOSPicker, selectedRange?.end, selectedRange?.start, selectedValue],
  );

  const renderTrigger = useCallback(
    (labelText: string, target: Target) => (
      <Pressable
        onPress={() => openPicker(target)}
        style={[
          styles.trigger,
          {
            backgroundColor: colors.card || colors.background,
            borderColor: error ? colors.danger : colors.border || colors.muted,
            opacity: disabled ? 0.6 : 1,
          },
        ]}
      >
        <Text
          style={{
            color:
              labelText === placeholder
                ? colors.mutedForeground || (isDark ? '#94a3b8' : '#64748b')
                : colors.foreground,
          }}
        >
          {labelText}
        </Text>
        <Text style={{ color: colors.mutedForeground || '#64748b', fontSize: 16 }}>▾</Text>
      </Pressable>
    ),
    [colors.background, colors.border, colors.card, colors.danger, colors.foreground, colors.muted, colors.mutedForeground, disabled, error, isDark, openPicker, placeholder],
  );

  const pickerBaseValue = useMemo(() => {
    // Use temp value when picker is visible to allow user to scroll without confirming
    if (pickerVisible) {
      return tempPickerValue;
    }
    // Otherwise use actual selected value
    if (!range) {
      return selectedValue ?? new Date();
    }
    if (pickerTarget === 'start') {
      return selectedRange?.start ?? new Date();
    }
    if (pickerTarget === 'end') {
      return selectedRange?.end ?? new Date();
    }
    return new Date();
  }, [pickerVisible, pickerTarget, range, selectedRange?.end, selectedRange?.start, selectedValue, tempPickerValue]);

  return (
    <View style={{ marginBottom: 16 }}>
      {label && (
        <Text style={{ fontSize: 14, fontWeight: '600', color: colors.foreground, marginBottom: 8 }}>
          {label}
        </Text>
      )}

      {range ? (
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>{renderTrigger(rangeStartLabel, 'start')}</View>
          <View style={{ flex: 1 }}>{renderTrigger(rangeEndLabel, 'end')}</View>
        </View>
      ) : (
        renderTrigger(singleLabel, 'single')
      )}

      {error ? (
        <Text style={{ color: colors.danger, fontSize: 12, marginTop: 4 }}>{error}</Text>
      ) : helperText ? (
        <Text style={{ color: colors.mutedForeground || (isDark ? '#94a3b8' : '#64748b'), fontSize: 12, marginTop: 4 }}>
          {helperText}
        </Text>
      ) : null}

      {Platform.OS === 'ios' && pickerVisible ? (
        <Modal transparent animationType="slide" visible onRequestClose={() => setPickerVisible(false)}>
          <View style={styles.iosModalBackdrop}>
            <View style={[styles.iosModal, { backgroundColor: colors.card || (isDark ? '#0f172a' : '#fff') }]}>
              <View style={styles.iosModalHeader}>
                <Pressable onPress={() => setPickerVisible(false)}>
                  <Text style={{ color: colors.mutedForeground || '#94a3b8', fontSize: 16 }}>{cancelLabel}</Text>
                </Pressable>
                <Text style={{ color: colors.foreground, fontWeight: '600' }}>
                  {pickerTarget === 'start' ? 'Start' : pickerTarget === 'end' ? 'End' : 'Select'}
                </Text>
                <Pressable
                  onPress={() => {
                    handleConfirm(pickerTarget, tempPickerValue);
                    setPickerVisible(false);
                  }}
                >
                  <Text style={{ color: colors.accent, fontSize: 16 }}>{confirmLabel}</Text>
                </Pressable>
              </View>
              <DateTimePicker
                mode={mode === 'datetime' ? 'datetime' : mode}
                value={tempPickerValue}
                display="spinner"
                onChange={(_event, date) => {
                  // Only update temp value, don't confirm yet
                  if (date) {
                    setTempPickerValue(date);
                  }
                }}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                themeVariant={isDark ? 'dark' : 'light'}
              />
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iosModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.45)',
    justifyContent: 'flex-end',
  },
  iosModal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    minHeight: 300,
  },
  iosModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
});


