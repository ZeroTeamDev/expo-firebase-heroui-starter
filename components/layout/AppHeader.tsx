// Created by Kien AI (leejungkiin@gmail.com)
import React from 'react';
import { View, Text } from 'react-native';

export function AppHeader({ title }: { title: string }) {
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '600' }}>{title}</Text>
    </View>
  );
}
