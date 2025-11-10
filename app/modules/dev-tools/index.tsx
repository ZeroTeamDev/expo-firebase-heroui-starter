/**
 * Dev Tools Screen
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Main screen for development tools
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useTheme } from 'heroui-native';
import { AppHeader } from '@/components/layout/AppHeader';
import { Card } from 'heroui-native';
import { useRouter } from 'expo-router';
import { DataCard } from '@/components/data';

export default function DevToolsScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const tools = [
    {
      id: 'database',
      title: 'Database Browser',
      description: 'Browse and query Firestore collections',
      icon: '🗄️',
      onPress: () => router.push('/modules/dev-tools/database'),
    },
    {
      id: 'analytics',
      title: 'Analytics Debugger',
      description: 'View analytics events in real-time',
      icon: '📊',
      onPress: () => router.push('/modules/dev-tools/analytics'),
    },
    {
      id: 'ai',
      title: 'AI Playground',
      description: 'Test AI features and models',
      icon: '🤖',
      onPress: () => router.push('/modules/dev-tools/ai'),
    },
    {
      id: 'emulator',
      title: 'Firebase Emulator',
      description: 'Open Firebase Emulator UI',
      icon: '🔥',
      onPress: () => Linking.openURL('http://localhost:4000'),
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="Dev Tools" subtitle="Development and debugging tools" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {tools.map((tool) => (
            <TouchableOpacity
              key={tool.id}
              onPress={tool.onPress}
              style={styles.toolCard}
            >
              <Card className="rounded-xl overflow-hidden">
                <Card.Body style={{ padding: 16, gap: 8 }}>
                  <Text style={styles.icon}>{tool.icon}</Text>
                  <Text style={[styles.title, { color: colors.foreground }]}>
                    {tool.title}
                  </Text>
                  <Text style={[styles.description, { color: colors.mutedForeground }]}>
                    {tool.description}
                  </Text>
                </Card.Body>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  toolCard: {
    width: '48%',
  },
  icon: {
    fontSize: 32,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
  },
});

