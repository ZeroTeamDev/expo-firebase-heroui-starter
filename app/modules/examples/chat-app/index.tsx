/**
 * Chat App Screen
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Real-time chat example demonstrating real-time database operations
 */

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from 'heroui-native';
import { AppHeader } from '@/components/layout/AppHeader';
import { Card } from 'heroui-native';
import { FormInput } from '@/components/forms/FormInput';
import { FormButton } from '@/components/forms/FormButton';
import { useCollection, useMutation } from '@/hooks/use-firestore';
import { useAuthStore } from '@/stores/authStore';
import { DataCard } from '@/components/data';

interface Message {
  id?: string;
  text: string;
  userId: string;
  userName: string;
  timestamp: number;
}

export default function ChatAppScreen() {
  const { colors } = useTheme();
  const { user } = useAuthStore();
  const [messageText, setMessageText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  // Read messages collection with real-time subscription
  const { data: messages, loading } = useCollection<Message>('chat-messages', {
    subscribe: true,
    filters: {
      orderBy: [['timestamp', 'asc']],
      limit: 100,
    },
  });

  // Create mutation
  const { mutate: sendMessage, loading: sending } = useMutation();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages && messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!messageText.trim() || !user) return;

    try {
      await sendMessage('chat-messages', {
        text: messageText.trim(),
        userId: user.uid,
        userName: user.displayName || user.email || 'Anonymous',
        timestamp: Date.now(),
      });
      
      setMessageText('');
    } catch (error: any) {
      console.error('Error sending message:', error);
    }
  };

  const isMyMessage = (message: Message) => message.userId === user?.uid;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <AppHeader title="Chat App" subtitle="Real-time chat example" />
      
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      >
        {loading && messages && messages.length === 0 && (
          <Text style={[styles.empty, { color: colors.mutedForeground }]}>
            Loading messages...
          </Text>
        )}

        {messages && messages.length === 0 && !loading && (
          <Text style={[styles.empty, { color: colors.mutedForeground }]}>
            No messages yet. Start the conversation!
          </Text>
        )}

        {messages && messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageWrapper,
              isMyMessage(message) ? styles.myMessageWrapper : styles.otherMessageWrapper,
            ]}
          >
            <Card
              className="rounded-xl"
              style={{
                backgroundColor: isMyMessage(message)
                  ? colors.accent + '20'
                  : colors.card || colors.background,
                maxWidth: '80%',
              }}
            >
              <Card.Body style={{ padding: 12, gap: 4 }}>
                {!isMyMessage(message) && (
                  <Text style={[styles.userName, { color: colors.accent }]}>
                    {message.userName}
                  </Text>
                )}
                <Text style={[styles.messageText, { color: colors.foreground }]}>
                  {message.text}
                </Text>
                <Text style={[styles.timestamp, { color: colors.mutedForeground }]}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </Text>
              </Card.Body>
            </Card>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.inputContainer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <FormInput
          placeholder="Type a message..."
          value={messageText}
          onChangeText={setMessageText}
          onSubmitEditing={handleSend}
          multiline
          style={{ maxHeight: 100 }}
        />
        <FormButton
          title="Send"
          onPress={handleSend}
          loading={sending}
          disabled={!messageText.trim() || sending || !user}
          size="sm"
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
    gap: 12,
  },
  messageWrapper: {
    marginBottom: 8,
  },
  myMessageWrapper: {
    alignItems: 'flex-end',
  },
  otherMessageWrapper: {
    alignItems: 'flex-start',
  },
  userName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
  },
  empty: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    alignItems: 'flex-end',
  },
});

