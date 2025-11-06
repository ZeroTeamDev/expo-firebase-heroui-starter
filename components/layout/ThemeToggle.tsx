/**
 * ThemeToggle Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Theme toggle button with smooth rotation animation
 */

import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet, AccessibilityInfo } from 'react-native';
import { useTheme } from 'heroui-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { IconSymbol } from '@/components/ui/icon-symbol';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export interface ThemeToggleProps {
  size?: number;
  onToggle?: () => void;
}

export function ThemeToggle({ size = 24, onToggle }: ThemeToggleProps) {
  const { theme, toggleTheme, colors } = useTheme();
  const isDark = theme === 'dark';
  const rotation = useSharedValue(isDark ? 180 : 0);
  const scale = useSharedValue(1);

  useEffect(() => {
    rotation.value = withSpring(isDark ? 180 : 0, {
      damping: 15,
      stiffness: 200,
    });
  }, [isDark, rotation]);

  const handlePress = () => {
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Scale animation
    scale.value = withTiming(0.9, { duration: 100 }, () => {
      scale.value = withSpring(1, { damping: 10, stiffness: 300 });
    });

    toggleTheme();
    onToggle?.();
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value}deg` },
        { scale: scale.value },
      ],
    };
  });

  const iconName = isDark ? 'moon.fill' : 'sun.max.fill';
  const accessibilityLabel = isDark ? 'Switch to light theme' : 'Switch to dark theme';

  return (
    <AnimatedTouchableOpacity
      onPress={handlePress}
      style={[styles.container, { width: 44, height: 44 }]}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint="Toggles between light and dark theme"
    >
      <Animated.View style={animatedStyle}>
        <IconSymbol
          name={iconName}
          size={size}
          color={colors.foreground}
        />
      </Animated.View>
    </AnimatedTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
});

