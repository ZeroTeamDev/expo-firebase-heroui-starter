// Created by Kien AI (leejungkiin@gmail.com)
import React from 'react';
import { Text, View } from 'react-native';

export function AIStreaming({ text }: { text: string }) {
  return (
    <View style={{ padding: 8 }}>
      <Text>{text}</Text>
    </View>
  );
}
