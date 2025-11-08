/**
 * Modules Index Screen
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Navigation hub for all modules and examples
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, useTheme } from 'heroui-native';
import { AppHeader } from '@/components/layout/AppHeader';

const modules = [
  {
    id: 'database-example',
    title: 'Database Examples',
    description: 'Learn how to use Firestore with CRUD operations, real-time updates, and batch operations',
    route: '/modules/examples/database-example',
  },
  {
    id: 'analytics-example',
    title: 'Analytics Examples',
    description: 'Learn how to track events, screen views, and user properties',
    route: '/modules/examples/analytics-example',
  },
  {
    id: 'ai-example',
    title: 'AI Examples',
    description: 'Learn how to use AI services: chat, vision, speech, and embeddings',
    route: '/modules/examples/ai-example',
  },
  {
    id: 'ui-components-example',
    title: 'UI Components Library',
    description: 'Browse reusable data tables, lists, cards, and grids with live playgrounds',
    route: '/modules/examples/ui-components-example',
  },
  {
    id: 'notification-example',
    title: 'Notification Example',
    description: 'Complete notification system with inbox, settings, filtering, and push notification UI',
    route: '/modules/examples/notification-example',
  },
  {
    id: 'bottom-sheet-example',
    title: 'Bottom Sheet Examples',
    description: 'Explore reusable bottom sheet component with liquid glass effect, gestures, and multi-step navigation',
    route: '/modules/examples/bottom-sheet-example',
  },
];

export default function ModulesIndexScreen() {
  const router = useRouter();
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="Modules & Examples" />
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Examples</Text>
        <Text style={[styles.sectionDescription, { color: colors.foreground }]}>
          Explore working examples of all services and features
        </Text>

        {modules.map((module) => (
          <Card key={module.id} className="mb-4 rounded-xl overflow-hidden">
            <Card.Body className="p-4">
              <Text 
                style={[styles.cardTitle, { color: colors.foreground }]}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {module.title}
              </Text>
              <Text 
                style={[styles.cardDescription, { color: colors.foreground }]}
                numberOfLines={3}
                ellipsizeMode="tail"
              >
                {module.description}
              </Text>
              <Pressable
                onPress={() => router.push(module.route as any)}
                style={[styles.button, { backgroundColor: colors.accent }]}
              >
                <Text style={[styles.buttonText, { color: colors.accentForeground }]}>
                  Open Example
                    </Text>
              </Pressable>
            </Card.Body>
          </Card>
        ))}
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 24,
    lineHeight: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 16,
    lineHeight: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
