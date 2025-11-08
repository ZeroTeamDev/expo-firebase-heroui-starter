/**
 * AI Assistant Screen
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * AI assistant example demonstrating AI features
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from 'heroui-native';
import { AppHeader } from '@/components/layout/AppHeader';
import { Card } from 'heroui-native';
import { AIChip, AIPrompt, AIStreaming, AIConversation } from '@/components/ai';
import { useAIChat } from '@/hooks/use-ai';
import { Spinner } from '@/components/feedback/Spinner';
import { FormButton } from '@/components/forms/FormButton';

export default function AIAssistantScreen() {
  const { colors } = useTheme();
  const [conversationId, setConversationId] = useState<string | undefined>();

  const { startChat, isStreaming } = useAIChat(conversationId);

  const handleQuickPrompt = async (prompt: string) => {
    try {
      await startChat(
        {
          message: prompt,
          model: 'gemini-1.5-flash',
        },
        (chunk) => {
          // Chunk will be handled by AIConversation component
        },
      );
    } catch (error: any) {
      console.error('Error:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="AI Assistant" subtitle="Interactive AI assistant example" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card className="mb-4 rounded-xl">
          <Card.Body style={{ padding: 16, gap: 12 }}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Quick Actions
            </Text>
            <View style={styles.chips}>
              <AIChip
                onPress={() => handleQuickPrompt('Hello, how can you help me?')}
                label="Hello"
              />
              <AIChip
                onPress={() => handleQuickPrompt('Explain React Native in simple terms')}
                label="Explain React Native"
              />
              <AIChip
                onPress={() => handleQuickPrompt('Write a simple todo list app')}
                label="Code Example"
              />
              <AIChip
                onPress={() => handleQuickPrompt('What are the best practices for mobile apps?')}
                label="Best Practices"
              />
            </View>
          </Card.Body>
        </Card>

        <Card className="mb-4 rounded-xl">
          <Card.Body style={{ padding: 16, gap: 12 }}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Conversation
            </Text>
            <AIConversation conversationId={conversationId} />
          </Card.Body>
        </Card>

        {isStreaming && <Spinner />}
      </ScrollView>

      <View style={[styles.inputContainer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <AIPrompt
          onSubmit={async (text) => {
            await handleQuickPrompt(text);
          }}
          placeholder="Ask me anything..."
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  inputContainer: {
    padding: 16,
    borderTopWidth: 1,
  },
});

