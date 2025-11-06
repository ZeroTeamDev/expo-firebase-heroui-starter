// Created by Kien AI (leejungkiin@gmail.com)
import React from 'react';
import { View, Text } from 'react-native';
import { AppHeader } from '@/components/layout/AppHeader';

export default function ManagementModuleScreen() {
  return (
    <View style={{ flex: 1 }}>
      <AppHeader title="Management" />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Management module placeholder</Text>
      </View>
    </View>
  );
}


