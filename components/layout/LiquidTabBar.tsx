// Created by Kien AI (leejungkiin@gmail.com)
import React from 'react';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { GlassTabBar, type GlassTabBarProps, type TabBarTheme } from './GlassTabBar';

// Standardize LiquidTabBar to delegate to the improved GlassTabBar implementation
// Supports theme prop for custom tab bar colors
export interface LiquidTabBarProps extends BottomTabBarProps {
  tabBarTheme?: TabBarTheme; // Optional theme for tab bar colors
}

export function LiquidTabBar({ tabBarTheme, ...props }: LiquidTabBarProps) {
  return <GlassTabBar {...props} tabBarTheme={tabBarTheme} />;
}
