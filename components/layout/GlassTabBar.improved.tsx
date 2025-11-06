/**
 * GlassTabBar Component - IMPROVED VERSION
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Custom bottom tab bar with premium glass morphism effect and liquid blob animation.
 * Optimized for better visual quality and smooth animations.
 */

import { useTheme } from "heroui-native";
import { View, TouchableOpacity, type ViewStyle, StyleSheet, useWindowDimensions, Text, type LayoutChangeEvent } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
  type SharedValue,
  withSpring,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { GlassViewNative } from "@/components/glass/GlassViewNative";
import { Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

// Active tab layout info
interface ActiveTabLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

// IMPROVED: Better spring configuration for smoother animations
const SPRING_CONFIG = {
  damping: 25,
  stiffness: 200,
  mass: 0.5,
};

// IMPROVED: Optimized blur and glass parameters
const GLASS_CONFIG = {
  blurIntensity: 80, // Strong blur for glass effect
  overlayOpacity: 0.45, // Increased for better visibility
  borderRadius: 36, // More rounded for pill shape
  bubblePadding: 18, // Larger glow area
  whiteCircleSize: 58, // Slightly larger white circle
  tabBarHeight: 72, // Increased height for better pill proportion
};

// IMPROVED: Liquid glass bubble with better colors and animations
function LiquidGlassBubble({
  layout,
  accentColor,
  isActive,
}: {
  layout: ActiveTabLayout | null;
  accentColor: string;
  isActive: boolean;
}) {
  const scale = useSharedValue(isActive ? 1 : 0);
  const opacity = useSharedValue(isActive ? 1 : 0);
  const animatedX = useSharedValue(layout?.x || 0);
  const animatedY = useSharedValue(layout?.y || 0);
  const animatedWidth = useSharedValue(layout?.width || 0);
  const animatedHeight = useSharedValue(layout?.height || 0);

  useEffect(() => {
    if (layout) {
      // IMPROVED: Smoother spring animations
      animatedX.value = withSpring(layout.x, SPRING_CONFIG);
      animatedY.value = withSpring(layout.y, SPRING_CONFIG);
      animatedWidth.value = withSpring(layout.width, SPRING_CONFIG);
      animatedHeight.value = withSpring(layout.height, SPRING_CONFIG);
    }
  }, [layout, animatedX, animatedY, animatedWidth, animatedHeight]);

  useEffect(() => {
    if (isActive && layout) {
      scale.value = withSpring(1, SPRING_CONFIG);
      opacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) });
    } else {
      scale.value = withTiming(0, { duration: 200 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [isActive, layout, scale, opacity]);

  if (!layout) {
    return null;
  }

  const bubbleAnimatedStyle = useAnimatedStyle(() => {
    const bubbleWidth = animatedWidth.value + (GLASS_CONFIG.bubblePadding * 2);
    const bubbleHeight = animatedHeight.value + (GLASS_CONFIG.bubblePadding * 2);
    const borderRadius = Math.min(bubbleWidth, bubbleHeight) / 2;

    return {
      left: animatedX.value - GLASS_CONFIG.bubblePadding,
      top: animatedY.value - GLASS_CONFIG.bubblePadding,
      width: bubbleWidth,
      height: bubbleHeight,
      borderRadius,
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  // IMPROVED: Subtle shadow for depth
  const shadowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scale.value, [0, 1], [0, 0.12], Extrapolate.CLAMP),
  }));

  return (
    <>
      {/* IMPROVED: Softer shadow */}
      <Animated.View
        style={[
          {
            position: "absolute",
            backgroundColor: "transparent",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 3 },
            shadowRadius: 12,
            shadowOpacity: 0.15,
            zIndex: 4,
          },
          bubbleAnimatedStyle,
          shadowStyle,
        ]}
      />

      {/* IMPROVED: Glass bubble with accent color glow */}
      <Animated.View
        style={[
          {
            position: "absolute",
            overflow: "hidden",
            zIndex: 5,
          },
          bubbleAnimatedStyle,
        ]}
      >
        {Platform.OS === "ios" ? (
          <GlassViewNative
            type="clear"
            cornerStyle="circular"
            style={StyleSheet.absoluteFill}
            blurIntensity={60}
            borderRadius={GLASS_CONFIG.borderRadius}
          >
            {/* IMPROVED: Accent color glow - MUCH MORE VISIBLE */}
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  borderRadius: GLASS_CONFIG.borderRadius,
                  backgroundColor: `${accentColor}50`, // 50% opacity - much more visible!
                },
              ]}
            />

            {/* IMPROVED: More visible white border */}
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  borderRadius: GLASS_CONFIG.borderRadius,
                  borderWidth: 2,
                  borderColor: "rgba(255, 255, 255, 0.7)", // More opaque border
                },
              ]}
            />

            {/* IMPROVED: Stronger inner glow */}
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  borderRadius: GLASS_CONFIG.borderRadius,
                  backgroundColor: "rgba(255, 255, 255, 0.25)", // Increased opacity
                },
              ]}
            />
          </GlassViewNative>
        ) : (
          <>
            <BlurView
              intensity={60}
              tint="light"
              style={StyleSheet.absoluteFill}
            />

            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: `${accentColor}50`, // More visible for Android
                  borderRadius: GLASS_CONFIG.borderRadius,
                },
              ]}
            />

            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  borderRadius: GLASS_CONFIG.borderRadius,
                  borderWidth: 2,
                  borderColor: "rgba(255, 255, 255, 0.7)",
                },
              ]}
            />

            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  borderRadius: GLASS_CONFIG.borderRadius,
                  backgroundColor: "rgba(255, 255, 255, 0.25)",
                },
              ]}
            />
          </>
        )}
      </Animated.View>
    </>
  );
}

// IMPROVED: Tab item with better animations and measurements
function TabItem({
  route,
  options,
  isFocused,
  onPress,
  onLongPress,
  colors,
  onLayout,
  tabBarRef,
}: {
  route: any;
  options: any;
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  colors: any;
  onLayout: (layout: ActiveTabLayout) => void;
  tabBarRef: React.RefObject<View>;
}) {
  const scale = useSharedValue(isFocused ? 1 : 0.85);
  const opacity = useSharedValue(isFocused ? 1 : 0.6);
  const iconScale = useSharedValue(isFocused ? 1 : 0.9);
  const whiteCircleRef = useRef<View>(null);

  useEffect(() => {
    // IMPROVED: Better scale and opacity animations
    scale.value = withSpring(isFocused ? 1.08 : 0.85, SPRING_CONFIG);
    opacity.value = withTiming(isFocused ? 1 : 0.6, {
      duration: 250,
      easing: Easing.out(Easing.cubic),
    });
    iconScale.value = withSpring(isFocused ? 1.1 : 0.9, {
      damping: 20,
      stiffness: 180,
    });
  }, [isFocused, scale, opacity, iconScale]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  // Measure white circle layout
  const handleWhiteCircleLayout = useCallback((event: LayoutChangeEvent) => {
    if (!isFocused || !tabBarRef.current) return;

    const { width, height } = event.nativeEvent.layout;

    tabBarRef.current.measureInWindow((tabBarX, tabBarY) => {
      whiteCircleRef.current?.measureInWindow((circleX, circleY) => {
        const centerX = (circleX - tabBarX) + (width / 2);
        const centerY = (circleY - tabBarY) + (height / 2);

        const layout: ActiveTabLayout = {
          x: centerX - (width / 2),
          y: centerY - (height / 2),
          width,
          height,
        };
        onLayout(layout);
      });
    });
  }, [isFocused, onLayout, tabBarRef]);

  useEffect(() => {
    if (isFocused) {
      const timer = setTimeout(() => {
        whiteCircleRef.current?.measureInWindow((x, y, width, height) => {
          if (tabBarRef.current && width > 0 && height > 0) {
            handleWhiteCircleLayout({ nativeEvent: { layout: { x, y, width, height } } } as any);
          }
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isFocused, handleWhiteCircleLayout, tabBarRef]);

  const label =
    options.tabBarLabel !== undefined
      ? options.tabBarLabel
      : options.title !== undefined
      ? options.title
      : route.name;

  const iconElement = options.tabBarIcon
    ? typeof options.tabBarIcon === "function"
      ? options.tabBarIcon({
          focused: isFocused,
          color: isFocused ? colors.accent : colors.mutedForeground,
          size: isFocused ? 28 : 24,
        })
      : options.tabBarIcon
    : null;

  return (
    <Animated.View
      collapsable={false}
      style={[
        {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 6,
          paddingHorizontal: 8,
          position: "relative",
          zIndex: isFocused ? 10 : 1,
        },
        animatedContainerStyle,
      ]}
    >
      {/* IMPROVED: White circle with better sizing */}
      <View
        ref={whiteCircleRef}
        onLayout={handleWhiteCircleLayout}
        collapsable={false}
        style={{
          ...(isFocused && {
            backgroundColor: "white",
            borderRadius: GLASS_CONFIG.whiteCircleSize / 2,
            padding: 12,
            minWidth: GLASS_CONFIG.whiteCircleSize,
            minHeight: GLASS_CONFIG.whiteCircleSize,
            // IMPROVED: Subtle shadow for white circle
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 8,
            shadowOpacity: 0.1,
          }),
        }}
      >
        <TouchableOpacity
          onPress={onPress}
          onLongPress={onLongPress}
          activeOpacity={0.7}
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Animated.View style={animatedIconStyle}>
            {iconElement || (
              <IconSymbol
                name={typeof label === "string" ? label.toLowerCase().replace(/\s+/g, ".") : "circle"}
                size={isFocused ? 28 : 24}
                color={isFocused ? colors.accent : colors.mutedForeground}
              />
            )}
          </Animated.View>

          {/* Tab label - hide if empty */}
          {typeof label === "string" && label.length > 0 && (
            <Text
              style={{
                fontSize: isFocused ? 11 : 10,
                fontWeight: isFocused ? "600" : "400",
                color: isFocused ? colors.accent : colors.mutedForeground,
                marginTop: 3,
              }}
            >
              {label}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

export function GlassTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors, theme } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const isDark = theme === "dark";
  const tabBarRef = useRef<View>(null);

  const activeIndex = state.index;
  const routes = state.routes;

  const [activeTabLayout, setActiveTabLayout] = useState<ActiveTabLayout | null>(null);

  const handleActiveTabLayout = useCallback((layout: ActiveTabLayout) => {
    if (layout && layout.width > 0 && layout.height > 0) {
      setActiveTabLayout(layout);
    }
  }, []);

  const blurTint: "light" | "dark" | "default" = isDark ? "dark" : "light";
  const insets = useSafeAreaInsets();

  // IMPROVED: Better spacing calculations
  const bottomMargin = Math.max(insets.bottom + 8, 16);
  const horizontalMargin = 20;

  const tabBarContainerStyle: ViewStyle = useMemo(() => ({
    position: "absolute",
    bottom: bottomMargin,
    left: horizontalMargin,
    right: horizontalMargin,
    alignItems: "center",
    justifyContent: "center",
  }), [bottomMargin, horizontalMargin]);

  const tabBarWidth = screenWidth - (horizontalMargin * 2);

  const tabBarStyle: ViewStyle = useMemo(() => ({
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 6,
    justifyContent: "space-around",
    position: "relative",
    width: tabBarWidth,
    height: GLASS_CONFIG.tabBarHeight, // Fixed height for pill shape
    overflow: "visible",
    borderRadius: GLASS_CONFIG.borderRadius,
  }), [tabBarWidth]);

  const handleTabPress = useCallback((route: any, isFocused: boolean) => {
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      navigation.navigate(route.name, route.params);
    }
  }, [navigation]);

  return (
    <View style={tabBarContainerStyle}>
      <View
        style={[
          tabBarStyle,
          {
            // IMPROVED: Softer shadow for floating effect
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: isDark ? 0.4 : 0.12,
            shadowRadius: 20,
            elevation: 10,
          },
        ]}
        ref={tabBarRef}
      >
        {/* IMPROVED: Better blur intensity */}
        <BlurView
          intensity={GLASS_CONFIG.blurIntensity}
          tint={blurTint}
          style={[
            StyleSheet.absoluteFill,
            {
              borderRadius: GLASS_CONFIG.borderRadius,
            },
          ]}
        />

        {/* IMPROVED: Lighter overlay for better glass transparency */}
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: isDark
                ? `rgba(30, 30, 30, ${GLASS_CONFIG.overlayOpacity})`
                : `rgba(255, 255, 255, ${GLASS_CONFIG.overlayOpacity})`,
              borderRadius: GLASS_CONFIG.borderRadius,
            },
          ]}
          pointerEvents="none"
        />

        {/* IMPROVED: Subtle gradient for depth */}
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              borderRadius: GLASS_CONFIG.borderRadius,
              borderWidth: 1,
              borderColor: isDark
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(255, 255, 255, 0.3)",
            },
          ]}
          pointerEvents="none"
        />

        {/* Liquid glass bubble */}
        {activeIndex >= 0 && activeTabLayout && (
          <LiquidGlassBubble
            layout={activeTabLayout}
            accentColor={colors.accent}
            isActive={activeTabLayout !== null}
          />
        )}

        {/* Tab items */}
        {routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          return (
            <TabItem
              key={route.key}
              route={route}
              options={options}
              isFocused={isFocused}
              onPress={() => handleTabPress(route, isFocused)}
              onLongPress={() => {
                navigation.emit({
                  type: "tabLongPress",
                  target: route.key,
                });
              }}
              colors={colors}
              onLayout={handleActiveTabLayout}
              tabBarRef={tabBarRef}
            />
          );
        })}
      </View>
    </View>
  );
}
