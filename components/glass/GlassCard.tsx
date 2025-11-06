// Created by Kien AI (leejungkiin@gmail.com)
import React from 'react';
import { View, ViewProps } from 'react-native';

export function GlassCard({ children, style, ...rest }: ViewProps & { children?: React.ReactNode }) {
  return (
    <View style={[{ padding: 16, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }, style]} {...rest}>
      {children}
    </View>
  );
}
