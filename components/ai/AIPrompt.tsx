// Created by Kien AI (leejungkiin@gmail.com)
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  TextInputProps,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useThemeColor } from '@/hooks/use-theme-color';

type SuggestionResolver = (value: string) => Promise<string[]> | string[];

export interface AIPromptProps extends Omit<TextInputProps, 'onChangeText' | 'onSubmitEditing'> {
  /** Initial prompt value */
  initialValue?: string;
  /** Maximum characters displayed in counter */
  maxLength?: number;
  /** Called when prompt text changes */
  onChangeText?: (value: string) => void;
  /** Called when user submits the prompt */
  onSubmit?: (value: string) => void | Promise<void>;
  /** Async suggestion provider */
  onRequestSuggestions?: SuggestionResolver;
  /** Provide custom suggestions list */
  suggestions?: string[];
  /** Show loading state when request is running */
  loading?: boolean;
  /** Enable prompt history navigation */
  enableHistory?: boolean;
  /** Pre-seeded prompt history */
  history?: string[];
  /** Clear prompt after successful submit */
  clearOnSubmit?: boolean;
}

export interface AIPromptHandle {
  focus: () => void;
  clear: () => void;
}

function useDebouncedValue<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export const AIPrompt = forwardRef<AIPromptHandle, AIPromptProps>(function AIPrompt(
  {
    initialValue = '',
    maxLength = 4000,
    onChangeText,
    onSubmit,
    onRequestSuggestions,
    suggestions,
    loading = false,
    enableHistory = true,
    history: initialHistory = [],
    clearOnSubmit = false,
    style,
    ...textInputProps
  },
  ref,
) {
  const [value, setValue] = useState(initialValue);
  const [height, setHeight] = useState(56);
  const [localSuggestions, setLocalSuggestions] = useState<string[]>([]);
  const [suggesting, setSuggesting] = useState(false);
  const [history, setHistory] = useState<string[]>(initialHistory);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<TextInput>(null);

  const backgroundColor = useThemeColor({ light: '#f4f4f5', dark: '#111827' }, 'background');
  const borderColor = useThemeColor({ light: '#d4d4d8', dark: '#1f2937' }, 'icon');
  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({ light: '#6b7280', dark: '#9ca3af' }, 'icon');

  const debouncedValue = useDebouncedValue(value, 250);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    clear: () => {
      setValue('');
      onChangeText?.('');
    },
  }));

  const resolvedSuggestions = useMemo(() => {
    const list = suggestions ?? localSuggestions;
    return list.filter((item) => item.toLowerCase().includes(value.toLowerCase())).slice(0, 4);
  }, [localSuggestions, suggestions, value]);

  const handleChange = useCallback(
    (text: string) => {
      setValue(text);
      setHistoryIndex(-1);
      onChangeText?.(text);
    },
    [onChangeText],
  );

  const handleSubmit = useCallback(async () => {
    const payload = value.trim();
    if (!payload) return;

    await Promise.resolve(onSubmit?.(payload));
    setHistory((prev) => [payload, ...prev.filter((item) => item !== payload)].slice(0, 20));
    setHistoryIndex(-1);
    if (clearOnSubmit) {
      setValue('');
      onChangeText?.('');
    }
  }, [clearOnSubmit, onChangeText, onSubmit, value]);

  const handleSuggestionPress = useCallback(
    async (suggestion: string) => {
      await Haptics.selectionAsync();
      setValue(suggestion);
      onChangeText?.(suggestion);
      // Autofocus input for quick confirmation
      requestAnimationFrame(() => inputRef.current?.focus());
    },
    [onChangeText],
  );

  const handleHistoryNav = useCallback(
    (direction: 'prev' | 'next') => {
      if (!enableHistory || history.length === 0) return;

      setHistoryIndex((prev) => {
        const next = direction === 'prev' ? Math.min(prev + 1, history.length - 1) : Math.max(prev - 1, -1);

        if (next >= 0) {
          const nextValue = history[next];
          setValue(nextValue);
          onChangeText?.(nextValue);
        } else if (direction === 'next') {
          setValue('');
          onChangeText?.('');
        }

        return next;
      });
    },
    [enableHistory, history, onChangeText],
  );

  const handleContentSizeChange = useCallback((event: any) => {
    const nextHeight = Math.min(Math.max(event.nativeEvent.contentSize.height + 24, 56), 160);
    setHeight(nextHeight);
  }, []);

  const handleKeyPress = useCallback(
    (event: NativeSyntheticEvent<TextInputKeyPressEventData & { shiftKey?: boolean; preventDefault?: () => void }>) => {
      const { nativeEvent } = event;
      if (!enableHistory) return;
      if (nativeEvent.key === 'ArrowUp') {
        handleHistoryNav('prev');
      } else if (nativeEvent.key === 'ArrowDown') {
        handleHistoryNav('next');
      } else if (
        nativeEvent.key === 'Enter' &&
        Platform.OS === 'web' &&
        !(nativeEvent as any).shiftKey
      ) {
        nativeEvent.preventDefault?.();
        handleSubmit();
      }
    },
    [enableHistory, handleHistoryNav, handleSubmit],
  );

  useEffect(() => {
    if (!onRequestSuggestions) return;
    if (!debouncedValue.trim()) {
      setLocalSuggestions([]);
      return;
    }

    let cancelled = false;
    setSuggesting(true);

    Promise.resolve(onRequestSuggestions(debouncedValue))
      .then((result) => {
        if (!cancelled) {
          setLocalSuggestions(result);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLocalSuggestions([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setSuggesting(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedValue, onRequestSuggestions]);

  return (
    <View style={styles.container}>
      <View
        style={[styles.promptWrapper, { backgroundColor, borderColor, minHeight: height }, style]}
      >
        <TextInput
          ref={inputRef}
          style={[styles.input, { color: textColor, minHeight: height - 16 }]}
          placeholder="Ask the AI assistant…"
          placeholderTextColor={placeholderColor}
          multiline
          textAlignVertical="top"
          value={value}
          onChangeText={handleChange}
          onContentSizeChange={handleContentSizeChange}
          onKeyPress={Platform.OS === 'web' ? handleKeyPress : undefined}
          blurOnSubmit={false}
          {...textInputProps}
        />

        <View style={styles.statusRow}>
          <Text style={styles.counter}>
            {value.length}/{maxLength}
          </Text>

          <View style={styles.actions}>
            {enableHistory && history.length > 0 && (
              <View style={styles.historyButtons}>
                <Pressable
                  accessibilityLabel="Previous prompt"
                  onPress={() => handleHistoryNav('prev')}
                  style={({ pressed }) => [styles.historyButton, pressed && styles.historyPressed]}
                >
                  <Text style={styles.historyLabel}>Prev</Text>
                </Pressable>
                <Pressable
                  accessibilityLabel="Next prompt"
                  onPress={() => handleHistoryNav('next')}
                  style={({ pressed }) => [styles.historyButton, pressed && styles.historyPressed]}
                >
                  <Text style={styles.historyLabel}>Next</Text>
                </Pressable>
              </View>
            )}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Send prompt"
              onPress={handleSubmit}
              style={({ pressed }) => [styles.sendButton, pressed && styles.sendButtonPressed]}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.sendLabel}>Send</Text>}
            </Pressable>
          </View>
        </View>
      </View>

      {(suggesting || resolvedSuggestions.length > 0) && (
        <View style={styles.suggestionWrapper}>
          {suggesting ? (
            <View style={styles.suggestionLoading}>
              <ActivityIndicator size="small" />
              <Text style={styles.suggestionHint}>Thinking of suggestions…</Text>
            </View>
          ) : (
            resolvedSuggestions.map((suggestion) => (
              <Pressable
                key={suggestion}
                onPress={() => handleSuggestionPress(suggestion)}
                style={({ pressed }) => [styles.suggestionItem, pressed && styles.suggestionPressed]}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </Pressable>
            ))
          )}
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 8,
  },
  promptWrapper: {
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  counter: {
    fontSize: 12,
    color: '#9ca3af',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
  },
  historyButtons: {
    flexDirection: 'row',
    columnGap: 6,
  },
  historyButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(148, 163, 184, 0.12)',
  },
  historyPressed: {
    opacity: 0.8,
  },
  historyLabel: {
    fontSize: 12,
    color: '#E5E7EB',
  },
  sendButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#6366F1',
  },
  sendButtonPressed: {
    opacity: 0.85,
  },
  sendLabel: {
    color: '#fff',
    fontWeight: '600',
  },
  suggestionWrapper: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.24)',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    padding: 10,
    gap: 6,
  },
  suggestionLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
  },
  suggestionHint: {
    color: '#CBD5F5',
    fontSize: 12,
  },
  suggestionItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
  },
  suggestionPressed: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
  },
  suggestionText: {
    color: '#E0E7FF',
    fontSize: 14,
  },
});

export type { AIPromptHandle };
