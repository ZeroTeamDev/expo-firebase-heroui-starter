/**
 * LiquidGlassButton Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Reusable button component with liquid glass effect
 * Perfect for close buttons, icon buttons, and action buttons
 */

import React, { memo, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  PressableProps,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from 'heroui-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import type { LucideIcon } from 'lucide-react-native';

// Animation configuration
const SPRING_CONFIG = {
  damping: 15,
  stiffness: 300,
  mass: 0.5,
};

// Combined style configurations
const BUTTON_STYLES = {
  light: {
    // Neumorphic Inset Shadows
    shadowDark: 'rgba(163, 177, 198, 0.6)',
    shadowLight: 'rgba(255, 255, 255, 0.9)',
    // Liquid Glass Surface (from BottomSheet)
    glassGradient: ['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.1)'],
    glassBorder: 'rgba(255, 255, 255, 0.3)',
    // Highlight border gradient for top-left lighting effect
    highlightGradient: [
      'rgba(255, 255, 255, 0.6)', // Top-left: bright white
      'rgba(255, 255, 255, 0.0)', // Top-right: transparent
      'rgba(255, 255, 255, 0.0)', // Bottom-left: transparent
      'rgba(255, 255, 255, 0.0)', // Bottom-right: transparent
    ],
    // Text and icon color on glass
    textColor: '#374151', // Darker for better contrast on glass
    // Disabled state
    disabledBackgroundColor: 'rgba(229, 231, 235, 0.8)',
    disabledTextColor: '#9ca3af',
  },
  dark: {
    // Neumorphic Inset Shadows
    shadowDark: 'rgba(0, 0, 0, 0.3)',
    shadowLight: 'rgba(255, 255, 255, 0.08)',
    // Liquid Glass Surface (from BottomSheet)
    glassGradient: ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'],
    glassBorder: 'rgba(255, 255, 255, 0.2)',
    // Highlight border gradient for top-left lighting effect
    highlightGradient: [
      'rgba(255, 255, 255, 0.3)', // Top-left: bright white
      'rgba(255, 255, 255, 0.0)', // Top-right: transparent
      'rgba(255, 255, 255, 0.0)', // Bottom-left: transparent
      'rgba(255, 255, 255, 0.0)', // Bottom-right: transparent
    ],
    // Text and icon color on glass
    textColor: '#E5E7EB', // Lighter for contrast
    // Disabled state
    disabledBackgroundColor: 'rgba(55, 65, 81, 0.8)',
    disabledTextColor: '#9ca3af',
  },
};

export interface LiquidGlassButtonProps extends Omit<PressableProps, 'style'> {
  /**
   * Button label text (optional if using icon only)
   */
  label?: string;

  /**
   * Icon component from lucide-react-native
   */
  icon?: LucideIcon;

  /**
   * Icon size (default: 20)
   */
  iconSize?: number;

  /**
   * Button variant
   * @default 'default'
   */
  variant?: 'default' | 'icon' | 'text' | 'filled';

  /**
   * Button size
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Whether button is in loading state
   * @default false
   */
  loading?: boolean;

  /**
   * Whether button is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Blur intensity for glass effect
   * @default 20
   */
  blurIntensity?: number;

  /**
   * Custom container style
   */
  style?: ViewStyle;

  /**
   * Custom text style
   */
  textStyle?: TextStyle;

  /**
   * Enable haptic feedback on press
   * @default true
   */
  enableHaptics?: boolean;

  /**
   * Enable press animation
   * @default true
   */
  enableAnimation?: boolean;

  /**
   * Custom gradient colors (overrides theme colors)
   */
  gradientColors?: string[];

  /**
   * Custom background color (overrides theme colors)
   */
  backgroundColor?: string;

  /**
   * Custom border color (overrides theme colors)
   */
  borderColor?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const LiquidGlassButton = memo<LiquidGlassButtonProps>(({
  label,
  icon: Icon,
  iconSize = 20,
  variant = 'default',
  size = 'medium',
  loading = false,
  disabled = false,
  blurIntensity = 10, // Synced with BottomSheet.tsx
  style,
  textStyle,
  enableHaptics = true,
  enableAnimation = true,
  gradientColors,
  backgroundColor,
  borderColor,
  onPress,
  onPressIn,
  onPressOut,
  ...restProps
}) => {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  // Animation values
  const scale = useSharedValue(1);

  // Get soft UI colors based on theme
  const uiColors = isDark ? BUTTON_STYLES.dark : BUTTON_STYLES.light;

  // Size configurations
  const sizeConfig = useMemo(() => {
    switch (size) {
      case 'small':
        return {
          height: 32,
          paddingHorizontal: 12,
          borderRadius: 16,
          iconSize: 16,
          fontSize: 14,
        };
      case 'large':
        return {
          height: 48,
          paddingHorizontal: 24,
          borderRadius: 24,
          iconSize: 24,
          fontSize: 16,
        };
      default: // medium
        return {
          height: 36,
          paddingHorizontal: 16,
          borderRadius: 18,
          iconSize: 20,
          fontSize: 15,
        };
    }
  }, [size]);

  // Variant-specific styles
  const variantConfig = useMemo(() => {
    switch (variant) {
      case 'icon':
        return {
          width: sizeConfig.height,
          paddingHorizontal: 0,
          borderRadius: sizeConfig.height / 2,
        };
      case 'text':
        return {
          paddingHorizontal: sizeConfig.paddingHorizontal,
          borderRadius: sizeConfig.borderRadius,
        };
      case 'filled':
        return {
          paddingHorizontal: sizeConfig.paddingHorizontal,
          borderRadius: sizeConfig.borderRadius,
          gradient: [colors.accent, colors.accent],
          shadowColor: colors.accent,
        };
      default:
        return {
          paddingHorizontal: sizeConfig.paddingHorizontal,
          borderRadius: sizeConfig.borderRadius,
        };
    }
  }, [variant, sizeConfig, colors.accent]);

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // Handle press events
  const handlePressIn = (event: any) => {
    if (enableAnimation && !disabled && !loading) {
      scale.value = withSpring(0.97, SPRING_CONFIG);
    }
    if (enableHaptics && !disabled && !loading) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPressIn?.(event);
  };

  const handlePressOut = (event: any) => {
    if (enableAnimation && !disabled && !loading) {
      scale.value = withSpring(1, SPRING_CONFIG);
    }
    onPressOut?.(event);
  };

  const handlePress = (event: any) => {
    if (disabled || loading) return;
    if (enableHaptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress?.(event);
  };

  const borderRadius = variantConfig.borderRadius || sizeConfig.borderRadius;
  
  // Get gradient for filled variant
  const filledGradient = variant === 'filled' && variantConfig.gradient
    ? variantConfig.gradient
    : [colors.accent, colors.accent];
  
  const textColor = disabled
    ? uiColors.disabledTextColor
    : variant === 'filled'
    ? colors.accentForeground
    : uiColors.textColor;

  const renderContent = () => (
    <>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={textColor}
        />
      ) : (
        <>
          {Icon && (
            <Icon
              size={iconSize || sizeConfig.iconSize}
              color={textColor}
              style={label ? styles.iconWithLabel : undefined}
            />
          )}
          {label && (
            <Text
              style={[
                styles.label,
                {
                  fontSize: sizeConfig.fontSize,
                  color: textColor,
                  fontWeight: variant === 'filled' ? '600' : '500',
                },
                textStyle,
              ]}
            >
              {label}
            </Text>
          )}
        </>
      )}
    </>
  );

  // For the default/icon variant, we create a double shadow effect with a glass core.
  if (variant !== 'filled') {
    return (
      <View style={{ borderRadius, backgroundColor: 'transparent' }}>
        {/* Top-left light "glow" */}
        <View
          style={[
            styles.highlight,
            {
              borderRadius,
              shadowColor: disabled ? 'transparent' : uiColors.shadowLight,
              shadowOffset: { width: -3, height: -3 },
            },
          ]}
        />
        <AnimatedPressable
          {...restProps}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled || loading}
          style={[
            styles.container,
            {
              borderRadius,
              shadowColor: disabled ? 'transparent' : uiColors.shadowDark,
            },
            style,
            animatedStyle,
          ]}
        >
          {disabled ? (
            <View
              style={[
                styles.core,
                {
                  borderRadius,
                  width: variantConfig.width,
                  height: sizeConfig.height,
                  paddingHorizontal: variantConfig.paddingHorizontal,
                  backgroundColor: uiColors.disabledBackgroundColor,
                },
              ]}
            >
              {renderContent()}
            </View>
          ) : (
            <View style={[styles.core, {
              borderRadius,
              width: variantConfig.width,
              height: sizeConfig.height,
              paddingHorizontal: variantConfig.paddingHorizontal,
              borderColor: uiColors.glassBorder,
              borderWidth: 1,
              overflow: 'hidden',
            }]}>
              <BlurView
                intensity={20}
                tint={isDark ? 'dark' : 'light'}
                style={StyleSheet.absoluteFill}
              />
              <LinearGradient
                colors={uiColors.glassGradient as [string, string, ...string[]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              {/* Highlight border overlay for top-left lighting effect */}
              <View
                style={[
                  StyleSheet.absoluteFill,
                  {
                    borderTopWidth: 1.5,
                    borderLeftWidth: 1.5,
                    borderTopColor: isDark 
                      ? 'rgba(255, 255, 255, 0.4)' 
                      : 'rgba(255, 255, 255, 0.7)',
                    borderLeftColor: isDark 
                      ? 'rgba(255, 255, 255, 0.4)' 
                      : 'rgba(255, 255, 255, 0.7)',
                    borderTopLeftRadius: borderRadius,
                  },
                ]}
                pointerEvents="none"
              />
              {/* Additional gradient overlay for softer highlight effect */}
              <LinearGradient
                colors={uiColors.highlightGradient as [string, string, string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              {renderContent()}
            </View>
          )}
        </AnimatedPressable>
      </View>
    );
  }

  // For the "filled" variant, we use a simpler single shadow.
  return (
    <AnimatedPressable
      {...restProps}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[
        styles.container,
        {
          borderRadius,
          shadowColor: disabled ? 'transparent' : variantConfig.shadowColor,
          shadowOpacity: 0.4,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
        },
        style,
        animatedStyle,
      ]}
    >
      <LinearGradient
        colors={filledGradient as [string, string, ...string[]]}
        style={[
          styles.core,
          {
            borderRadius,
            width: variantConfig.width,
            height: sizeConfig.height,
            paddingHorizontal: variantConfig.paddingHorizontal,
          },
        ]}
      >
        {renderContent()}
      </LinearGradient>
    </AnimatedPressable>
  );


});

LiquidGlassButton.displayName = 'LiquidGlassButton';

const styles = StyleSheet.create({
  container: {
    // This view creates the dark, bottom-right shadow
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 8, // for Android
  },
  highlight: {
    // This is a separate view to create the top-left light "glow"
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 8,
  },
  core: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    zIndex: 1,
  },
  iconWithLabel: {
    marginRight: 8,
  },
  label: {
    fontWeight: '500',
  },
});

