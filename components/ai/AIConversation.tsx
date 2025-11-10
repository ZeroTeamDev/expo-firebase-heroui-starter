// Created by Kien AI (leejungkiin@gmail.com)
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import * as Haptics from 'expo-haptics';
import { useAIChat } from '@/hooks/use-ai';
import { useAIStore } from '@/stores/aiStore';
import type { ConversationMessage } from '@/services/ai/types';
import { AIPrompt } from './AIPrompt';
import { AIStreaming } from './AIStreaming';

type ChatController = ReturnType<typeof useAIChat>;

export interface AIConversationProps {
  conversationId?: string;
  title?: string;
  autoScroll?: boolean;
  enableExport?: boolean;
  enableClear?: boolean;
  onExport?: (messages: ConversationMessage[]) => void;
  onClear?: () => void;
  controller?: ChatController;
}

export function AIConversation({
  conversationId,
  title = 'Conversation',
  autoScroll = true,
  enableExport = true,
  enableClear = true,
  onExport,
  onClear,
  controller,
}: AIConversationProps) {
  const scrollRef = useRef<ScrollView>(null);
  const fallbackController = useAIChat(conversationId);
  const { messages, isStreaming, currentMessage, startChat, clearConversation, error } = controller ?? fallbackController;
  const conversation = useMemo(() => messages, [messages]);
  const [pending, setPending] = useState(false);
  const setCurrentConversation = useAIStore((state) => state.setCurrentConversation);
  const clearConversationInStore = useAIStore((state) => state.clearConversation);
  const activeConversationId = useAIStore((state) => state.currentConversationId);

  useEffect(() => {
    if (conversationId) {
      setCurrentConversation(conversationId);
    }
  }, [conversationId, setCurrentConversation]);

  useEffect(() => {
    if (!autoScroll) return;
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
  }, [autoScroll, conversation.length, currentMessage, isStreaming]);

  const handleSend = useCallback(
    async (prompt: string) => {
      if (!prompt.trim()) return;
      try {
        setPending(true);
        await startChat({ message: prompt, conversationId });
      } finally {
        setPending(false);
      }
    },
    [conversationId, startChat],
  );

  const handleClear = useCallback(async () => {
    if (!enableClear) return;
    const targetId = conversationId ?? activeConversationId;
    if (!targetId) return;

    const executeClear = async () => {
      clearConversation(targetId);
      clearConversationInStore(targetId);
      onClear?.();
    };

    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Clear conversation history?');
      if (confirmed) {
        await executeClear();
      }
    } else {
      Alert.alert('Clear conversation?', 'This will remove all messages for this chat.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => executeClear() },
      ]);
    }
  }, [activeConversationId, clearConversation, clearConversationInStore, conversationId, enableClear, onClear]);

  const handleExport = useCallback(async () => {
    if (!enableExport) return;
    if (conversation.length === 0) return;

    const transcript = conversation
      .map((msg) => `${msg.role.toUpperCase()} (${new Date(msg.timestamp).toLocaleString()}):\n${msg.content}`)
      .join('\n\n');

    try {
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(transcript);
      }
      onExport?.(conversation);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (Platform.OS !== 'web') {
        Alert.alert('Export ready', 'Transcript prepared. Copy is available on web builds.');
      }
    } catch {
      if (Platform.OS !== 'web') {
        Alert.alert('Export ready', 'Transcript prepared. Copy is available on web builds.');
      }
    }
  }, [conversation, enableExport, onExport]);

  const renderedMessages = useMemo(() => {
    if (conversation.length === 0) {
      return null;
    }

    return conversation.map((item, index) => {
      const isAssistant = item.role === 'assistant';
      const isLatestAssistant =
        isAssistant && index === conversation.length - 1 && (currentMessage.length > 0 || isStreaming);

      if (isLatestAssistant) {
        return (
          <AIStreaming
            key={item.id}
            text={currentMessage.length ? currentMessage : item.content}
            isStreaming={isStreaming}
            usage={{ tokens: item.usage?.totalTokens }}
            onRegenerate={() => handleSend(item.content)}
          />
        );
      }

      if (isAssistant) {
        return (
          <View key={item.id} style={styles.assistantBubble}>
            <Markdown
              style={{
                body: styles.assistantText,
                code_block: styles.codeBlock,
                blockquote: styles.blockQuote,
              }}
            >
              {item.content}
            </Markdown>
          </View>
        );
      }

      return (
        <View key={item.id} style={styles.userBubble}>
          <Text style={styles.userText}>{item.content}</Text>
        </View>
      );
    });
  }, [conversation, currentMessage, handleSend, isStreaming]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.headerActions}>
          {enableExport && (
            <Pressable onPress={handleExport} style={({ pressed }) => [styles.headerButton, pressed && styles.headerButtonPressed]}>
              <Text style={styles.headerButtonLabel}>Export</Text>
            </Pressable>
          )}
          {enableClear && (
            <Pressable onPress={handleClear} style={({ pressed }) => [styles.headerButton, pressed && styles.headerButtonPressed]}>
              <Text style={styles.headerButtonLabel}>Clear</Text>
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[
          styles.messages,
          conversation.length === 0 && styles.emptyMessages,
        ]}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
      >
        {renderedMessages ?? (
          <Text style={styles.emptyState}>Start the conversation by sending a message.</Text>
        )}
      </ScrollView>

      {error && <Text style={styles.error}>{error.message}</Text>}

      <AIPrompt
        clearOnSubmit
        loading={pending || isStreaming}
        maxLength={4000}
        onSubmit={handleSend}
        enableHistory
        style={styles.prompt}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingVertical: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#e2e8f0',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(148, 163, 184, 0.12)',
  },
  headerButtonPressed: {
    opacity: 0.85,
  },
  headerButtonLabel: {
    color: '#f8fafc',
    fontWeight: '600',
  },
  messages: {
    gap: 12,
    paddingBottom: 8,
    flexGrow: 1,
  },
  emptyMessages: {
    justifyContent: 'center',
  },
  assistantBubble: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.14)',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    padding: 16,
    gap: 8,
  },
  assistantText: {
    color: '#e2e8f0',
    fontSize: 16,
    lineHeight: 24,
  },
  codeBlock: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    padding: 12,
    borderRadius: 12,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
    color: '#cbd5f5',
  },
  blockQuote: {
    borderLeftWidth: 3,
    borderLeftColor: '#6366f1',
    paddingLeft: 12,
    color: '#cbd5f5',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    maxWidth: '85%',
  },
  userText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
  },
  emptyState: {
    textAlign: 'center',
    marginTop: 32,
    color: '#94a3b8',
  },
  error: {
    color: '#fca5a5',
    fontSize: 13,
  },
  prompt: {
    marginTop: 4,
  },
});


