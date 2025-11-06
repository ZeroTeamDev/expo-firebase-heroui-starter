// Created by Kien AI (leejungkiin@gmail.com)
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

export function AIChip({ onPress }: { onPress?: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: '#222' }}>
      <Text style={{ color: 'white' }}>AI</Text>
    </TouchableOpacity>
  );
}
