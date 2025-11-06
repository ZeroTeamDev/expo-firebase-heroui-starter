// Created by Kien AI (leejungkiin@gmail.com)
import React from 'react';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { GlassTabBar } from './GlassTabBar';

// Standardize LiquidTabBar to delegate to the improved GlassTabBar implementation
export function LiquidTabBar(props: BottomTabBarProps) {
  return <GlassTabBar {...props} />;
}
