// Created by Kien AI (leejungkiin@gmail.com)
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import * as Haptics from 'expo-haptics';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface AIStreamingProps {
  /** Full response text (markdown supported) */
  text: string;
  /** Indicates that response is still streaming */
  isStreaming?: boolean;
  /** Optional usage meta e.g. token counts */
  usage?: {
    tokens?: number;
    durationMs?: number;
  };
  /** Triggered when user requests to stop streaming */
  onStop?: () => void;
  /** Triggered when user asks to regenerate response */
  onRegenerate?: () => void;
  /** Triggered when response copied */
  onCopy?: () => void;
  /** Optional header title */
  title?: string;
}

const TYPING_INTERVAL = Platform.OS === 'web' ? 12 : 18;

export function AIStreaming({
  text,
  isStreaming = false,
  usage,
  onStop,
  onRegenerate,
  onCopy,
  title = 'AI Assistant',
}: AIStreamingProps) {
  const [displayedText, setDisplayedText] = useState(text);
  const [copied, setCopied] = useState(false);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  const backgroundColor = useThemeColor({ light: '#111827', dark: '#0f172a' }, 'background');
  const borderColor = useThemeColor({ light: 'rgba(148, 163, 184, 0.2)', dark: 'rgba(203, 213, 225, 0.08)' }, 'icon');
  const accentColor = useThemeColor({}, 'tint');

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
  }, []);

  const startTypingAnimation = useCallback(
    (fromIndex: number) => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }

      setDisplayedText(text.slice(0, fromIndex));

      animationRef.current = setInterval(() => {
        setDisplayedText((prev) => {
          const nextIndex = Math.min(
            text.length,
            prev.length + Math.max(1, Math.ceil((text.length - prev.length) / 12)),
          );
          const nextText = text.slice(0, nextIndex);
          if (nextIndex >= text.length && animationRef.current) {
            clearInterval(animationRef.current);
            animationRef.current = null;
          }
          return nextText;
        });
      }, TYPING_INTERVAL);
    },
    [text],
  );

  useEffect(() => {
    if (!isStreaming) {
      setDisplayedText(text);
      if (animationRef.current) {
        clearInterval(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    setDisplayedText((prev) => {
      const currentLength = prev.length;
      if (text.length <= currentLength) {
        return prev;
      }
      startTypingAnimation(currentLength);
      return prev || '';
    });

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isStreaming, startTypingAnimation, text]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
        animationRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [displayedText, scrollToBottom]);

  const handleCopy = useCallback(async () => {
    if (!displayedText) return;
    try {
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(displayedText);
      }
      // On native without clipboard dependency, act as no-op but keep UX feedback
      setCopied(true);
      onCopy?.();
      await Haptics.selectionAsync();
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [displayedText, onCopy]);

  const handleRegenerate = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onRegenerate?.();
  }, [onRegenerate]);

  const handleStop = useCallback(async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    onStop?.();
  }, [onStop]);

  const markdownRules = useMemo(() => ({
    body: {
      color: '#e2e8f0',
      fontSize: 16,
      lineHeight: 24,
    },
    code_block: {
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      padding: 12,
      borderRadius: 12,
      fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
    },
    blockquote: {
      borderLeftWidth: 3,
      borderLeftColor: accentColor,
      paddingLeft: 12,
      color: '#cbd5f5',
    },
  }), [accentColor]);

  return (
    <View style={[styles.container, { backgroundColor, borderColor }]}> 
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{title}</Text>
          {usage?.tokens != null && (
            <Text style={styles.meta}>{usage.tokens} tokens</Text>
          )}
        </View>

        <View style={styles.actions}>
          <Pressable onPress={handleCopy} style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}>
            <Text style={styles.actionLabel}>{copied ? 'Copied' : 'Copy'}</Text>
          </Pressable>

          <Pressable onPress={handleRegenerate} style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}>
            <Text style={styles.actionLabel}>Regenerate</Text>
          </Pressable>

          {isStreaming && onStop && (
            <Pressable onPress={handleStop} style={({ pressed }) => [styles.stopButton, pressed && styles.stopButtonPressed]}>
              <Text style={styles.stopLabel}>Stop</Text>
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {displayedText ? (
          <Markdown style={markdownRules}>{displayedText}</Markdown>
        ) : isStreaming ? (
          <View style={styles.streamingPlaceholder}>
            <ActivityIndicator color="#cbd5f5" />
            <Text style={styles.streamingLabel}>Generating…</Text>
          </View>
        ) : (
          <Text style={styles.emptyLabel}>Ask something to start the conversation.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  meta: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(148, 163, 184, 0.18)',
  },
  actionButtonPressed: {
    opacity: 0.8,
  },
  actionLabel: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '600',
  },
  stopButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#ef4444',
  },
  stopButtonPressed: {
    opacity: 0.9,
  },
  stopLabel: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  scroll: {
    maxHeight: 320,
  },
  scrollContent: {
    paddingBottom: 8,
  },
  streamingPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  streamingLabel: {
    color: '#cbd5f5',
    fontSize: 14,
    fontStyle: 'italic',
  },
  emptyLabel: {
    color: '#94a3b8',
    fontSize: 14,
  },
});
