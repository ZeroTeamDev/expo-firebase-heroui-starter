/**
 * GlassPanel Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Base glass wrapper component with blur + gradient + border effect.
 * Implements glass morphism using expo-blur with gradient overlay.
 */

import { useTheme } from "heroui-native";
import { View, type ViewProps, Platform, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { memo } from "react";

export interface GlassPanelProps extends ViewProps {
  /**
   * Blur intensity (0-100)
   * @default 20
   */
  blurIntensity?: number;
  /**
   * Opacity of the glass effect (0-1)
   * @default 0.9
   */
  opacity?: number;
  /**
   * Border radius
   * @default 16
   */
  borderRadius?: number;
  /**
   * Gradient colors (light, dark)
   */
  gradientColors?: {
    light?: string;
    dark?: string;
  };
  /**
   * Whether to show border
   * @default true
   */
  showBorder?: boolean;
}

function GlassPanelComponent({
  style,
  blurIntensity = 20,
  opacity = 0.9,
  borderRadius = 16,
  gradientColors,
  showBorder = true,
  children,
  ...otherProps
}: GlassPanelProps) {
  const { colors, theme } = useTheme();
  const isDark = theme === "dark";

  // Default gradient colors based on theme
  const defaultGradientColors = {
    light: `rgba(255, 255, 255, ${opacity * 0.7})`,
    dark: `rgba(30, 30, 30, ${opacity * 0.8})`,
  };

  const gradientColor = gradientColors
    ? isDark
      ? gradientColors.dark || defaultGradientColors.dark
      : gradientColors.light || defaultGradientColors.light
    : isDark
      ? defaultGradientColors.dark
      : defaultGradientColors.light;

  // Blur tint based on theme
  const blurTint: "light" | "dark" | "default" = isDark ? "dark" : "light";

  const containerStyle = {
    borderRadius,
    overflow: "hidden" as const,
    borderWidth: showBorder ? 1 : 0,
    borderColor: colors.border + "40", // Semi-transparent border
    shadowColor: isDark ? "#000" : "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 8,
    elevation: 4, // Android shadow
  };

  return (
    <View style={[containerStyle, style]} {...otherProps}>
      <BlurView
        intensity={blurIntensity}
        tint={blurTint}
        style={StyleSheet.absoluteFill}
      />
      {/* Gradient overlay for glass effect */}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: gradientColor,
            borderRadius,
          },
        ]}
      />
      {/* Content */}
      <View style={{ position: "relative", zIndex: 1 }}>{children}</View>
    </View>
  );
}

export const GlassPanel = memo(GlassPanelComponent);

