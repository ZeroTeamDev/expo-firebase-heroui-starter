/**
 * Home Screen
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Main dashboard with quick access to modules and examples
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, useTheme } from 'heroui-native';
import { AppHeader } from '@/components/layout/AppHeader';
import { useScreenTracking } from '@/hooks/use-analytics';
import { useAuthStore } from '@/stores/authStore';
import { logout } from '@/integrations/firebase.client';
import { useTabBarPadding } from '@/hooks/use-tab-bar-padding';

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  useScreenTracking('home');
  const user = useAuthStore((s) => s.user);
  const bottomPadding = useTabBarPadding();

  const quickLinks = [
    {
      title: 'Database Examples',
      description: 'Firestore CRUD operations',
      route: '/modules/examples/database-example',
      icon: '💾',
    },
    {
      title: 'Analytics Examples',
      description: 'Event tracking & analytics',
      route: '/modules/examples/analytics-example',
      icon: '📊',
    },
    {
      title: 'AI Examples',
      description: 'AI chat, vision, speech',
      route: '/modules/examples/ai-example',
      icon: '🤖',
    },
    {
      title: 'All Modules',
      description: 'Browse all modules',
      route: '/modules',
      icon: '📦',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="Home" />
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={[styles.content, { paddingBottom: bottomPadding }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Auth status panel for testing */}
        <Card className="mb-4 rounded-xl overflow-hidden">
          <Card.Body className="p-4">
            <View style={{ gap: 8 }}>
              <Text style={{ color: colors.foreground, fontWeight: '600' }}>Authentication</Text>
              <Text style={{ color: colors.foreground, opacity: 0.8 }}>
                Signed in as: {user?.email || 'Unknown user'}
              </Text>
              <Pressable
                onPress={async () => {
                  try {
                    await logout();
                    router.replace('/auth');
                  } catch (e) {
                    console.warn('Logout failed', e);
                  }
                }}
                disabled={!user}
                style={[
                  styles.openButton,
                  { backgroundColor: user ? colors.danger : colors.border },
                ]}
              >
                <Text style={[
                  styles.openButtonText,
                  { color: user ? colors.dangerForeground : colors.mutedForeground }
                ]}>{user ? 'Logout' : 'Logout (disabled)'}</Text>
              </Pressable>
            </View>
          </Card.Body>
        </Card>

        <Text style={[styles.welcomeTitle, { color: colors.foreground }]}>
          Welcome to Expo AI Starter Kit
        </Text>
        <Text style={[styles.welcomeDescription, { color: colors.foreground }]}>
          A comprehensive starter kit with Firebase, AI services, and beautiful UI components.
          Get started by exploring the examples below.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Quick Links</Text>
        {quickLinks.map((link, index) => (
          <Card key={index} className="mb-4 rounded-xl overflow-hidden">
            <Card.Body className="p-4">
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>{link.icon}</Text>
                <View style={styles.cardContent}>
                  <Text 
                    style={[styles.cardTitle, { color: colors.foreground }]}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {link.title}
                  </Text>
                  <Text 
                    style={[styles.cardDescription, { color: colors.foreground }]}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {link.description}
                    </Text>
                  </View>
        </View>
              <Pressable
                onPress={() => router.push(link.route as any)}
                style={[styles.openButton, { backgroundColor: colors.accent }]}
              >
                <Text style={[styles.openButtonText, { color: colors.accentForeground }]}>
                  Open
                </Text>
              </Pressable>
            </Card.Body>
          </Card>
        ))}

        <Card className="mt-2 mb-8 rounded-xl overflow-hidden">
          <Card.Body className="p-4">
            <Text style={[styles.infoTitle, { color: colors.foreground }]}>Getting Started</Text>
            <Text style={[styles.infoText, { color: colors.foreground }]}>
              • Explore the examples to see how services work{'\n'}
              • Check the documentation in the docs/ folder{'\n'}
              • Use the unified services import: import from &apos;@/services&apos;{'\n'}
              • All services have auto error handling and retry logic
            </Text>
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
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  welcomeDescription: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 32,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardIcon: {
    fontSize: 32,
    marginRight: 12,
    flexShrink: 0,
  },
  cardContent: {
    flex: 1,
    minWidth: 0, // Important for text truncation
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
  },
  openButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  openButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 22,
  },
});
