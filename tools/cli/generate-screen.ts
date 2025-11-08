/**
 * Screen Generator
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Generates a new screen component
 */

import * as fs from 'fs';
import * as path from 'path';

const SCREEN_TEMPLATE = `/**
 * {ScreenTitle} Screen
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * {Description}
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from 'heroui-native';
import { AppHeader } from '@/components/layout/AppHeader';

export default function {ScreenName}Screen() {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="{ScreenTitle}" subtitle="{Subtitle}" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={[styles.text, { color: colors.foreground }]}>
            {ScreenTitle} Screen
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
    padding: 16,
  },
  text: {
    fontSize: 16,
  },
});
`;

export async function generateScreen(name: string, options: Record<string, string>) {
  // Convert name: my-screen -> MyScreen
  const ScreenName = name
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  
  const ScreenTitle = ScreenName.replace(/([A-Z])/g, ' $1').trim();
  const category = options.category || 'examples';
  const description = options.description || `${ScreenTitle} screen`;
  const subtitle = options.subtitle || `Screen for ${ScreenTitle.toLowerCase()}`;

  // Create screen directory
  const screenDir = path.join(process.cwd(), 'app', 'modules', category, name.toLowerCase());
  if (fs.existsSync(screenDir)) {
    throw new Error(`Screen already exists: ${name}`);
  }
  fs.mkdirSync(screenDir, { recursive: true });

  // Generate screen file
  const screenFile = path.join(screenDir, 'index.tsx');
  const screenContent = SCREEN_TEMPLATE.replace(/{ScreenName}/g, ScreenName)
    .replace(/{ScreenTitle}/g, ScreenTitle)
    .replace(/{Subtitle}/g, subtitle)
    .replace(/{Description}/g, description);

  fs.writeFileSync(screenFile, screenContent);

  console.log(`Generated screen: ${ScreenName}`);
  console.log(`  Location: app/modules/${category}/${name.toLowerCase()}/index.tsx`);
  console.log(`  Route: /modules/${category}/${name.toLowerCase()}`);
  
  // Note: Screen registration should be done manually or via module generator
  console.log(`  Note: Create a module definition to register this screen`);
}

