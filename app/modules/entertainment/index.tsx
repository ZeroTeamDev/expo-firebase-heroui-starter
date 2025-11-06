// Created by Kien AI (leejungkiin@gmail.com)
import React from 'react';
import { View, Text } from 'react-native';
import { AppHeader } from '@/components/layout/AppHeader';

export default function EntertainmentModuleScreen() {
  return (
    <View style={{ flex: 1 }}>
      <AppHeader title="Entertainment" />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Entertainment module placeholder</Text>
      </View>
    </View>
  );
}


