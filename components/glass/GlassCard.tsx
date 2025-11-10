/**
 * GlassCard Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Glass card component with enhanced styling for card-like containers
 */

import React from 'react';
import { ViewProps, StyleSheet } from 'react-native';
import { GlassViewNative, type GlassViewNativeProps } from './GlassViewNative';
import { useTheme } from 'heroui-native';

export interface GlassCardProps extends ViewProps {
  children?: React.ReactNode;
  blurIntensity?: number;
  opacity?: number;
  borderRadius?: number;
  padding?: number;
  type?: GlassViewNativeProps['type'];
  variant?: 'default' | 'elevated';
}

export function GlassCard({
  children,
  style,
  blurIntensity = 25,
  opacity = 0.85,
  borderRadius = 20,
  padding = 16,
  type = 'regular',
  variant = 'default',
  ...rest
}: GlassCardProps) {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  const shadowStyle =
    variant === 'elevated'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 6,
        }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        };

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
            ? 'rgba(255, 255, 255, 0.2)'
            : 'rgba(255, 255, 255, 0.4)',
          ...shadowStyle,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </GlassViewNative>
  );
}
