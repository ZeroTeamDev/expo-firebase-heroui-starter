// Created by Kien AI (leejungkiin@gmail.com)
import React from 'react';
import { View, ViewProps } from 'react-native';

export function GlassModal({ children }: ViewProps & { children?: React.ReactNode }) {
  return <View style={{ padding: 24 }}>{children}</View>;
}
