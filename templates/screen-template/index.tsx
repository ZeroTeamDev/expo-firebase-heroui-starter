/**
 * {{ScreenTitle}} Screen
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * {{Description}}
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from 'heroui-native';
import { AppHeader } from '@/components/layout/AppHeader';
import { Card } from 'heroui-native';

export default function {{ScreenName}}Screen() {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="{{ScreenTitle}}" subtitle="{{Subtitle}}" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card className="rounded-xl overflow-hidden">
          <Card.Body style={{ padding: 16 }}>
            <Text style={[styles.text, { color: colors.foreground }]}>
              {{ScreenTitle}} Screen
            </Text>
            <Text style={[styles.description, { color: colors.mutedForeground }]}>
              {{Description}}
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
  text: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
});

