/**
 * GlassPanel Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Reusable glass panel wrapper with blur and gradient effects
 */

import React from 'react';
import { ViewProps, StyleSheet } from 'react-native';
import { GlassViewNative, type GlassViewNativeProps } from './GlassViewNative';
import { useTheme } from 'heroui-native';

export interface GlassPanelProps extends ViewProps {
  children?: React.ReactNode;
  blurIntensity?: number;
  opacity?: number;
  borderRadius?: number;
  padding?: number;
  type?: GlassViewNativeProps['type'];
}

export function GlassPanel({
  children,
  style,
  blurIntensity = 20,
  opacity = 0.8,
  borderRadius = 16,
  padding = 12,
  type = 'regular',
  ...rest
}: GlassPanelProps) {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <GlassViewNative
      type={type}
      blurIntensity={blurIntensity}
      opacity={opacity}
      borderRadius={borderRadius}
      style={[
        {
          padding,
          borderWidth: 1,
          borderColor: isDark
            ? 'rgba(255, 255, 255, 0.15)'
            : 'rgba(255, 255, 255, 0.3)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </GlassViewNative>
  );
}
