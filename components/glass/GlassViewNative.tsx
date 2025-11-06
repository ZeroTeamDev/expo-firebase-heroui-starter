/**
 * GlassViewNative Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Platform-aware glass effect component using expo-liquid-glass-view on iOS
 * and expo-blur as fallback for Android/Web
 */

import { Platform, View, type ViewProps, StyleSheet } from "react-native";
import { useTheme } from "heroui-native";
import { memo } from "react";

// Fallback using expo-blur
import { BlurView } from "expo-blur";

// Conditional import - expo-liquid-glass-view only works on iOS
let ExpoLiquidGlassView: any = null;
let CornerStyle: any = null;
let LiquidGlassType: any = null;

if (Platform.OS === "ios") {
  try {
    const liquidGlassModule = require("expo-liquid-glass-view");
    ExpoLiquidGlassView = liquidGlassModule.ExpoLiquidGlassView;
    CornerStyle = liquidGlassModule.CornerStyle;
    LiquidGlassType = liquidGlassModule.LiquidGlassType;
  } catch (error) {
    // Fallback if expo-liquid-glass-view is not available
    console.warn("expo-liquid-glass-view not available, using fallback");
  }
}

export interface GlassViewNativeProps extends ViewProps {
  type?: "clear" | "tint" | "regular" | "interactive" | "identity";
  cornerStyle?: "continuous" | "circular";
  tint?: string;
  blurIntensity?: number;
  opacity?: number;
  borderRadius?: number;
}

function GlassViewNativeComponent({
  style,
  type = "regular",
  cornerStyle = "circular",
  tint,
  blurIntensity = 20,
  opacity = 0.9,
  borderRadius = 16,
  children,
  ...otherProps
}: GlassViewNativeProps) {
  const { colors, theme } = useTheme();
  const isDark = theme === "dark";

  // Use expo-liquid-glass-view on iOS if available
  if (Platform.OS === "ios" && ExpoLiquidGlassView) {
    return (
      <ExpoLiquidGlassView
        type={type}
        cornerStyle={cornerStyle}
        cornerRadius={borderRadius}
        tint={tint}
        style={[style, { borderRadius, overflow: "hidden" }]}
        {...otherProps}
      >
        {children}
      </ExpoLiquidGlassView>
    );
  }

  // Fallback to expo-blur for Android/Web or if expo-liquid-glass-view is not available
  const blurTint: "light" | "dark" | "default" = isDark ? "dark" : "light";
  const gradientColor = isDark
    ? `rgba(30, 30, 30, ${opacity * 0.8})`
    : `rgba(255, 255, 255, ${opacity * 0.7})`;

  return (
    <View style={[{ borderRadius, overflow: "hidden" }, style]} {...otherProps}>
      <BlurView
        intensity={blurIntensity}
        tint={blurTint}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: gradientColor,
            borderRadius,
          },
        ]}
      />
      <View style={{ position: "relative", zIndex: 1 }}>{children}</View>
    </View>
  );
}

export const GlassViewNative = memo(GlassViewNativeComponent);
