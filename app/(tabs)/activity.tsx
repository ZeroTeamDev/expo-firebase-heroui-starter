/**
 * Activity Screen
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Activity placeholder screen
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from 'heroui-native';
import { AppHeader } from '@/components/layout/AppHeader';
import { useTabBarPadding } from '@/hooks/use-tab-bar-padding';

export default function ActivityScreen() {
  const { colors } = useTheme();
  const bottomPadding = useTabBarPadding();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="Activity" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: bottomPadding }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.placeholderContainer}>
          <Text style={[styles.placeholderTitle, { color: colors.foreground }]}>
            Activity
          </Text>
          <Text style={[styles.placeholderText, { color: colors.mutedForeground }]}>
            Your recent activity and updates
          </Text>
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
    flex: 1,
    padding: 16,
  },
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

