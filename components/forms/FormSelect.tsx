// Created by Kien AI (leejungkiin@gmail.com)
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from 'heroui-native';

export interface SelectOption {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

export interface FormSelectProps {
  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  value?: string | string[] | null;
  defaultValue?: string | string[];
  options?: SelectOption[];
  onChange?: (value: string | string[]) => void;
  multiple?: boolean;
  searchable?: boolean;
  asyncSearch?: boolean;
  onSearch?: (query: string) => Promise<SelectOption[]> | void;
  loading?: boolean;
  disabled?: boolean;
  maxSelectedLabelCount?: number;
}

export function FormSelect({
  label,
  placeholder = 'Select…',
  helperText,
  error,
  value,
  defaultValue,
  options = [],
  onChange,
  multiple = false,
  searchable = true,
  asyncSearch = false,
  onSearch,
  loading = false,
  disabled = false,
  maxSelectedLabelCount = 3,
}: FormSelectProps) {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [asyncOptions, setAsyncOptions] = useState<SelectOption[]>(options);
  const [asyncLoading, setAsyncLoading] = useState(false);

  const controlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string | string[] | null>(
    defaultValue ?? (multiple ? [] : null),
  );

  const currentValue = controlled ? value ?? (multiple ? [] : null) : internalValue;

  useEffect(() => {
    if (asyncSearch) {
      setAsyncOptions(options);
    }
  }, [asyncSearch, options]);

  const triggerText = useMemo(() => {
    if (!currentValue || (Array.isArray(currentValue) && currentValue.length === 0)) {
      return placeholder;
    }

    const selectedValues = Array.isArray(currentValue) ? currentValue : [currentValue];
    const lookup = asyncSearch ? asyncOptions : options;
    const labels = selectedValues
      .map((item) => lookup.find((opt) => opt.value === item)?.label ?? item)
      .filter(Boolean);

    if (!multiple) {
      return labels[0];
    }

    if (labels.length <= maxSelectedLabelCount) {
      return labels.join(', ');
    }

    const visible = labels.slice(0, maxSelectedLabelCount).join(', ');
    return `${visible} + ${labels.length - maxSelectedLabelCount} more`;
  }, [asyncOptions, asyncSearch, currentValue, maxSelectedLabelCount, multiple, options, placeholder]);

  const toggleValue = useCallback(
    (option: SelectOption) => {
      if (option.disabled) return;

      if (multiple) {
        const prev = Array.isArray(currentValue) ? currentValue : [];
        const exists = prev.includes(option.value);
        const next = exists ? prev.filter((item) => item !== option.value) : [...prev, option.value];
        if (!controlled) {
          setInternalValue(next);
        }
        onChange?.(next);
      } else {
        if (!controlled) {
          setInternalValue(option.value);
        }
        onChange?.(option.value);
        setOpen(false);
      }
    },
    [controlled, currentValue, multiple, onChange],
  );

  const isSelected = useCallback(
    (option: SelectOption) => {
      if (!currentValue) return false;
      if (Array.isArray(currentValue)) {
        return currentValue.includes(option.value);
      }
      return currentValue === option.value;
    },
    [currentValue],
  );

  useEffect(() => {
    if (!asyncSearch || !onSearch) return;

    let active = true;
    const runSearch = async () => {
      try {
        setAsyncLoading(true);
        const result = await onSearch(search);
        if (Array.isArray(result) && active) {
          setAsyncOptions(result);
        }
      } catch (err) {
        // swallow errors for now
      } finally {
        if (active) {
          setAsyncLoading(false);
        }
      }
    };

    if (searchable) {
      runSearch();
    }

    return () => {
      active = false;
    };
  }, [asyncSearch, onSearch, search, searchable]);

  const filteredOptions = useMemo(() => {
    const list = asyncSearch ? asyncOptions : options;
    if (!searchable || search.trim().length === 0) {
      return list;
    }
    const lowered = search.trim().toLowerCase();
    return list.filter(
      (opt) =>
        opt.label.toLowerCase().includes(lowered) ||
        (opt.description ? opt.description.toLowerCase().includes(lowered) : false),
    );
  }, [options, asyncOptions, asyncSearch, search, searchable]);

  return (
    <View style={{ marginBottom: 16 }}>
      {label && (
        <Text style={{ fontSize: 14, fontWeight: '600', color: colors.foreground, marginBottom: 8 }}>
          {label}
        </Text>
      )}
      <Pressable
        onPress={() => !disabled && setOpen(true)}
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
              !currentValue || (Array.isArray(currentValue) && currentValue.length === 0)
                ? colors.mutedForeground || (isDark ? '#818cf8' : '#475569')
                : colors.foreground,
          }}
        >
          {triggerText}
        </Text>
        <Text style={{ color: colors.mutedForeground || '#64748b', fontSize: 16 }}>▾</Text>
      </Pressable>

      {error ? (
        <Text style={{ color: colors.danger, fontSize: 12, marginTop: 4 }}>{error}</Text>
      ) : helperText ? (
        <Text style={{ color: colors.mutedForeground || (isDark ? '#94a3b8' : '#64748b'), fontSize: 12, marginTop: 4 }}>
          {helperText}
        </Text>
      ) : null}

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <View style={styles.backdrop}>
          <KeyboardAvoidingView
            behavior={Platform.select({ ios: 'padding', android: undefined })}
            style={styles.sheetContainer}
          >
            <Pressable style={styles.sheetOverlay} onPress={() => setOpen(false)} />
            <View
              style={[
                styles.sheet,
                {
                  backgroundColor: colors.card || (isDark ? '#0f172a' : '#fff'),
                  borderColor: colors.border || 'rgba(148,163,184,0.2)',
                },
              ]}
            >
              <View style={styles.sheetHeader}>
                <Text style={[styles.sheetTitle, { color: colors.foreground }]}>{label || 'Select items'}</Text>
                <Pressable onPress={() => setOpen(false)} hitSlop={8}>
                  <Text style={{ color: colors.mutedForeground || '#94a3b8', fontSize: 18 }}>Close</Text>
                </Pressable>
              </View>

              {searchable ? (
                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Search…"
                  autoFocus
                  style={[
                    styles.searchInput,
                    {
                      backgroundColor: isDark ? 'rgba(15,23,42,0.9)' : '#f8fafc',
                      color: colors.foreground,
                      borderColor: colors.border || 'rgba(148,163,184,0.2)',
                    },
                  ]}
                  placeholderTextColor={colors.mutedForeground || (isDark ? '#94a3b8' : '#94a3b8')}
                />
              ) : null}

              {loading || asyncLoading ? (
                <View style={styles.loading}>
                  <ActivityIndicator color={colors.accent} />
                </View>
              ) : filteredOptions.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={{ color: colors.mutedForeground || '#94a3b8' }}>No options found.</Text>
                </View>
              ) : (
                <FlatList
                  data={filteredOptions}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => {
                    const selected = isSelected(item);
                    return (
                      <Pressable
                        onPress={() => toggleValue(item)}
                        disabled={item.disabled}
                        style={[
                          styles.option,
                          {
                            opacity: item.disabled ? 0.5 : 1,
                            backgroundColor: selected
                              ? colors.accent
                              : colors.card || (isDark ? 'rgba(15,23,42,0.85)' : '#fff'),
                            borderColor: colors.border || 'rgba(148,163,184,0.25)',
                          },
                        ]}
                      >
                        <View style={{ flex: 1, gap: item.description ? 4 : 0 }}>
                          <Text
                            style={{
                              color: selected ? colors.accentForeground : colors.foreground,
                              fontWeight: selected ? '700' : '500',
                            }}
                          >
                            {item.label}
                          </Text>
                          {item.description ? (
                            <Text
                              style={{
                                color: selected
                                  ? colors.accentForeground
                                  : colors.mutedForeground || (isDark ? '#94a3b8' : '#64748b'),
                                fontSize: 12,
                              }}
                              numberOfLines={2}
                            >
                              {item.description}
                            </Text>
                          ) : null}
                        </View>
                        {multiple ? (
                          <View
                            style={[
                              styles.checkbox,
                              {
                                borderColor: selected
                                  ? colors.accentForeground
                                  : colors.mutedForeground || 'rgba(148,163,184,0.4)',
                                backgroundColor: selected ? colors.accentForeground : 'transparent',
                              },
                            ]}
                          >
                            {selected ? (
                              <Text style={{ color: colors.accent, fontWeight: '700' }}>✓</Text>
                            ) : null}
                          </View>
                        ) : selected ? (
                          <Text style={{ color: colors.accentForeground, fontWeight: '700' }}>✓</Text>
                        ) : null}
                      </Pressable>
                    );
                  }}
                  keyboardShouldPersistTaps="handled"
                  ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                  contentContainerStyle={{ paddingBottom: 12 }}
                />
              )}

              {multiple ? (
                <View style={styles.footerActions}>
                  <Pressable onPress={() => setOpen(false)} style={styles.footerButton}>
                    <Text style={{ color: colors.mutedForeground || '#64748b' }}>Done</Text>
                  </Pressable>
                </View>
              ) : null}
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
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
    gap: 12,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetOverlay: {
    flex: 1,
  },
  sheet: {
    maxHeight: '70%',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    gap: 12,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  loading: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyState: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  option: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  footerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  footerButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});


