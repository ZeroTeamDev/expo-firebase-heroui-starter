// Created by Kien AI (leejungkiin@gmail.com)
import React from 'react';
import { View, Text } from 'react-native';
import { Skeleton } from '@/components/common/Skeleton';
import { AppHeader } from '@/components/layout/AppHeader';

export default function ManagementModuleScreen() {
  return (
    <View style={{ flex: 1 }}>
      <AppHeader title="Management" />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <Text>Management module placeholder</Text>
        <Skeleton width={220} />
        <Skeleton width={160} />
      </View>
    </View>
  );
}


