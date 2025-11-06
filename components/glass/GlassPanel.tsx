// Created by Kien AI (leejungkiin@gmail.com)
import React from 'react';
import { View, ViewProps } from 'react-native';

export function GlassPanel({ children, style, ...rest }: ViewProps & { children?: React.ReactNode }) {
  return (
    <View style={[{ padding: 12, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }, style]} {...rest}>
      {children}
    </View>
  );
}
