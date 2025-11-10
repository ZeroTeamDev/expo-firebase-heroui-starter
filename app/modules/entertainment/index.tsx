// Created by Kien AI (leejungkiin@gmail.com)
import React from 'react';
import { View, Text } from 'react-native';
import { Skeleton } from '@/components/common/Skeleton';
import { AppHeader } from '@/components/layout/AppHeader';

export default function EntertainmentModuleScreen() {
  return (
    <View style={{ flex: 1 }}>
      <AppHeader title="Entertainment" />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <Text>Entertainment module placeholder</Text>
        <Skeleton width={220} />
        <Skeleton width={160} />
      </View>
    </View>
  );
}


