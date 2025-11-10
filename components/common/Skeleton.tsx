// Created by Kien AI (leejungkiin@gmail.com)
import React from 'react';
import { View } from 'react-native';

export function Skeleton({ width = '80%', height = 14, radius = 8 }: { width?: number | string; height?: number; radius?: number }) {
  return (
    <View
      style={{
        width,
        height,
        borderRadius: radius,
        backgroundColor: 'rgba(180,180,180,0.2)',
      }}
    />
  );
}


