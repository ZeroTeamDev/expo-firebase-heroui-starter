// Created by Kien AI (leejungkiin@gmail.com)
import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from 'heroui-native';

export interface {{ComponentName}}Props {
  // Add your props here
  style?: ViewStyle;
}

export function {{ComponentName}}({ style }: {{ComponentName}}Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }, style]}>
      <Text style={[styles.text, { color: colors.foreground }]}>{{ComponentName}}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  text: {
    fontSize: 16,
  },
});

