/**
 * AI Playground Screen
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Test AI features and models
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from 'heroui-native';
import { AppHeader } from '@/components/layout/AppHeader';
import { Card } from 'heroui-native';
import { FormInput } from '@/components/forms/FormInput';
import { FormButton } from '@/components/forms/FormButton';
import { AIChip, AIPrompt, AIStreaming } from '@/components/ai';
import { useAIChat } from '@/hooks/use-ai';
import { Spinner } from '@/components/feedback/Spinner';

export default function AIPlaygroundScreen() {
  const { colors } = useTheme();
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const { startChat } = useAIChat();

  const handleSend = async () => {
    if (!prompt.trim()) return;

    setIsStreaming(true);
    setResponse('');

    try {
      await startChat(
        {
          message: prompt,
          model: 'gemini-1.5-flash',
        },
        (chunk) => {
          setResponse((prev) => prev + chunk);
        },
      );
    } catch (error: any) {
      setResponse(`Error: ${error.message}`);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="AI Playground" subtitle="Test AI features and models" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card className="mb-4 rounded-xl">
          <Card.Body style={{ padding: 16, gap: 12 }}>
            <FormInput
              label="Prompt"
              placeholder="Enter your prompt here..."
              value={prompt}
              onChangeText={setPrompt}
              multiline
              numberOfLines={4}
            />
            <FormButton
              title="Send"
              onPress={handleSend}
              disabled={!prompt.trim() || isStreaming}
            />
          </Card.Body>
        </Card>

        {isStreaming && <Spinner />}

        {response && (
          <Card className="mb-4 rounded-xl">
            <Card.Body style={{ padding: 16 }}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Response
              </Text>
              <AIStreaming content={response} />
            </Card.Body>
          </Card>
        )}

        <Card className="mb-4 rounded-xl">
          <Card.Body style={{ padding: 16, gap: 12 }}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Quick Actions
            </Text>
            <AIChip
              onPress={() => setPrompt('Hello, how are you?')}
              label="Quick Test"
            />
            <AIPrompt
              value={prompt}
              onChangeText={setPrompt}
              placeholder="Type your prompt..."
              onSubmit={handleSend}
            />
          </Card.Body>
        </Card>
      </ScrollView>
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
    marginBottom: 12,
  },
});

