/**
 * Admin Panel
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Main admin panel screen
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from 'heroui-native';
import { AppHeader } from '@/components/layout/AppHeader';
import { useTabBarPadding } from '@/hooks/use-tab-bar-padding';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { AdminOnly } from '@/components/permissions/AdminOnly';

export default function AdminPanelScreen() {
  const { colors, theme } = useTheme();
  const router = useRouter();
  const bottomPadding = useTabBarPadding();
  const isDark = theme === 'dark';

  const adminSections = [
    {
      id: 'config',
      title: 'Global Configuration',
      description: 'Configure app-wide settings',
      icon: 'slider.horizontal.3',
      route: '/(tabs)/admin/config',
    },
    {
      id: 'users',
      title: 'User Management',
      description: 'Manage users and roles',
      icon: 'person.2.fill',
      route: '/(tabs)/admin/users',
    },
    {
      id: 'files',
      title: 'File Management',
      description: 'Manage all files',
      icon: 'folder.fill',
      route: '/(tabs)/admin/files',
    },
    {
      id: 'groups',
      title: 'Group Management',
      description: 'Manage groups',
      icon: 'person.3.fill',
      route: '/(tabs)/admin/groups',
    },
  ];

  const renderSectionCard = (section: typeof adminSections[0]) => {
    return (
      <TouchableOpacity
        key={section.id}
        onPress={() => router.push(section.route as any)}
        style={[styles.card, { backgroundColor: colors.surface1 }]}
        activeOpacity={0.7}
      >
        <View style={styles.cardContent}>
          <View style={[styles.iconContainer, { backgroundColor: colors.accent + '20' }]}>
            <IconSymbol
              name={section.icon as any}
              size={24}
              color={colors.accent}
            />
          </View>
          <View style={styles.cardText}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>
              {section.title}
            </Text>
            <Text style={[styles.cardDescription, { color: colors.mutedForeground }]}>
              {section.description}
            </Text>
          </View>
          <IconSymbol
            name="chevron.right"
            size={20}
            color={colors.mutedForeground}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <AdminOnly
      fallback={
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <AppHeader title="Admin" />
          <View style={styles.unauthorized}>
            <Text style={[styles.unauthorizedText, { color: colors.foreground }]}>
              You do not have permission to access this area.
            </Text>
          </View>
        </View>
      }
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <AppHeader title="Admin Panel" />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.content, { paddingBottom: bottomPadding }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>
              Administration
            </Text>
            <Text style={[styles.headerDescription, { color: colors.mutedForeground }]}>
              Manage app settings, users, files, and groups
            </Text>
          </View>

          <View style={styles.sections}>
            {adminSections.map(renderSectionCard)}
          </View>
        </ScrollView>
      </View>
    </AdminOnly>
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
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerDescription: {
    fontSize: 16,
    lineHeight: 22,
  },
  sections: {
    gap: 12,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  unauthorized: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  unauthorizedText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

