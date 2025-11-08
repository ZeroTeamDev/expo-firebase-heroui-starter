/**
 * GlassTabBar Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Custom bottom tab bar with pill shape, enhanced glass morphism effect 
 * and liquid blob animation with spectrum/rainbow effect.
 * Designed to work with Expo Router Tabs.
 */

import { useTheme } from "heroui-native";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  useWindowDimensions,
  type LayoutChangeEvent,
} from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

// Active tab layout info for liquid bubble positioning
interface ActiveTabLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Tab bar theme configuration
export type TabBarTheme =
  | "blue" // Light blue (like in the image)
  | "pink" // Light pink
  | "red" // Light red
  | "yellow" // Light yellow
  | "green" // Light green
  | "purple" // Light purple
  | "orange" // Light orange
  | "cyan" // Light cyan
  | "default"; // Default white/transparent

// Theme color definitions - Simple border colors with transparent white background
// Background is transparent white with light glass effect to show content below
// Borders are also transparent for a subtle, elegant look
const TAB_BAR_THEMES: Record<
  TabBarTheme,
  {
    border: string; // Theme border color - transparent and subtle
  }
> = {
  blue: {
    border: "rgba(135, 206, 250, 0.4)", // Light Sky Blue border - very transparent
  },
  pink: {
    border: "rgba(255, 182, 193, 0.4)", // Light Pink border - very transparent
  },
  red: {
    border: "rgba(255, 160, 122, 0.4)", // Light Salmon border - very transparent
  },
  yellow: {
    border: "rgba(255, 250, 205, 0.4)", // Lemon Chiffon border - very transparent
  },
  green: {
    border: "rgba(152, 251, 152, 0.4)", // Pale Green border - very transparent
  },
  purple: {
    border: "rgba(230, 230, 250, 0.4)", // Lavender border - very transparent
  },
  orange: {
    border: "rgba(255, 228, 196, 0.4)", // Bisque border - very transparent
  },
  cyan: {
    border: "rgba(224, 255, 255, 0.4)", // Light Cyan border - very transparent
  },
  default: {
    border: "rgba(255, 255, 255, 0.4)", // White border - very transparent
  },
};

// Enhanced glass and pill shape configuration - Transparent glass effect
const GLASS_CONFIG = {
  blurIntensity: 40, // Light blur to show content below while maintaining glass effect
  overlayOpacity: 0.25, // Very transparent white overlay to show content below
  bubbleBlurIntensity: 60, // Moderate blur - enough for glass effect but still transparent
  bubbleOpacity: 0.05, // Very low white opacity - just a hint, mostly transparent
  borderOpacity: 0.4, // Border opacity
  tabBarHeight: 64, // Fixed height for pill shape
  horizontalMargin: 20, // Side margins
  bottomMargin: -10, // Bottom margin
  bubblePadding: 4, // Minimal padding to keep bubble inside tab bar (was 20)
};

// Spectrum gradient colors for liquid glass bubble - very subtle tint
// Very low opacity to allow background to show through
const SPECTRUM_GRADIENT_COLORS = [
  "rgba(255, 100, 180, 0.04)", // Magenta/Pink - very subtle tint
  "rgba(255, 160, 0, 0.04)", // Orange - very subtle tint
  "rgba(255, 220, 0, 0.04)", // Yellow - very subtle tint
  "rgba(100, 220, 100, 0.04)", // Lime Green - very subtle tint
  "rgba(50, 220, 220, 0.04)", // Cyan - very subtle tint
  "rgba(80, 170, 255, 0.04)", // Dodger Blue - very subtle tint
  "rgba(180, 140, 240, 0.04)", // Medium Purple - very subtle tint
];

// Timing config for smooth transitions (equivalent to CSS transition)
const TIMING_CONFIG = {
  duration: 500, // Match CSS transition duration
  easing: Easing.bezier(0.68, -0.55, 0.27, 1.55), // Match CSS cubic-bezier
};

// Liquid Glass Bubble - Inspired by HTML example with smooth sliding animation
function LiquidGlassBubble({
  layout,
  isActive,
}: {
  layout: ActiveTabLayout | null;
  isActive: boolean;
}) {
  // Use ref to track previous layout values - these persist across renders
  const previousLayoutRef = useRef<ActiveTabLayout | null>(null);

  // Initialize animated values - they will persist and animate smoothly
  const animatedX = useSharedValue(0);
  const animatedY = useSharedValue(0);
  const animatedWidth = useSharedValue(56);
  const animatedHeight = useSharedValue(48);
  const opacity = useSharedValue(0);

  // Animate position when layout changes (like HTML example with CSS transition)
  useEffect(() => {
    if (layout && layout.width > 0 && layout.height > 0) {
      const prevLayout = previousLayoutRef.current;

      // If no previous layout, set immediately (initial render)
      if (!prevLayout) {
        animatedX.value = layout.x;
        animatedY.value = layout.y;
        animatedWidth.value = layout.width;
        animatedHeight.value = layout.height;
        opacity.value = 1;
        previousLayoutRef.current = layout;
      } else {
        // If layout changed (different position), animate smoothly
        // This creates the sliding effect when switching tabs
        animatedX.value = withTiming(layout.x, TIMING_CONFIG);
        animatedY.value = withTiming(layout.y, TIMING_CONFIG);
        animatedWidth.value = withTiming(layout.width, TIMING_CONFIG);
        animatedHeight.value = withTiming(layout.height, TIMING_CONFIG);
        opacity.value = 1; // Keep visible during animation
        previousLayoutRef.current = layout;
      }
    }
    // When layout is null, keep previous values - bubble stays at last position
    // This allows smooth sliding when switching between tabs
  }, [layout, animatedX, animatedY, animatedWidth, animatedHeight, opacity]);

  // Always render bubble - control visibility via opacity only
  // This allows smooth sliding animation from one position to another

  const bubbleAnimatedStyle = useAnimatedStyle(() => {
    if (!layout || layout.width <= 0 || layout.height <= 0) {
      return {
        opacity: 0,
        width: 0,
        height: 0,
      };
    }

    // Add minimal padding around the circle
    const bubblePadding = GLASS_CONFIG.bubblePadding;
    const bubbleWidth = animatedWidth.value + bubblePadding * 2;
    const bubbleHeight = animatedHeight.value + bubblePadding * 2;

    // STRICT: Clamp bubble height to NEVER exceed tab bar height
    const maxBubbleHeight = GLASS_CONFIG.tabBarHeight - bubblePadding * 2; // Full padding margin
    const clampedBubbleHeight = Math.min(bubbleHeight, maxBubbleHeight);

    // Use current animated values - these will smoothly transition
    const currentX = animatedX.value;
    const currentY = animatedY.value;

    // Calculate bubble position
    const bubbleX = currentX - bubblePadding;
    const bubbleY = currentY - bubblePadding;

    // STRICT: Clamp bubble Y position to ALWAYS stay within tab bar bounds
    // Ensure: 0 <= top <= tabBarHeight - height
    const minY = bubblePadding; // Start from padding margin
    const maxY =
      GLASS_CONFIG.tabBarHeight - clampedBubbleHeight - bubblePadding; // End before padding margin
    const clampedBubbleY = Math.max(minY, Math.min(bubbleY, maxY));

    // Final safety check: ensure bubble never exceeds tab bar bounds
    const finalTop = Math.max(
      0,
      Math.min(clampedBubbleY, GLASS_CONFIG.tabBarHeight - clampedBubbleHeight)
    );
    const finalHeight = Math.min(
      clampedBubbleHeight,
      GLASS_CONFIG.tabBarHeight - finalTop
    );

    // Position bubble centered around the active circle, but STRICTLY within tab bar bounds
    return {
      position: "absolute",
      left: bubbleX,
      top: finalTop,
      width: bubbleWidth,
      height: finalHeight,
      borderRadius: Math.min(bubbleWidth, finalHeight) / 2,
      opacity: opacity.value,
    };
  });

  const glassBorderRadiusStyle = useAnimatedStyle(() => {
    const bubbleHeight = animatedHeight.value + GLASS_CONFIG.bubblePadding * 2;
    return {
      borderRadius: bubbleHeight / 2,
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          overflow: "hidden",
          zIndex: 1, // Below tab items (zIndex: 10)
        },
        bubbleAnimatedStyle,
      ]}
      pointerEvents="none" // Don't block touch events - let them pass through to tab items
    >
      {/* Glass morphism background with strong blur */}
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <BlurView
          intensity={GLASS_CONFIG.bubbleBlurIntensity} // Stronger blur for liquid glass effect
          tint="light"
          style={StyleSheet.absoluteFill}
        />
      </View>

      {/* Very subtle white base - mostly transparent to show background */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          glassBorderRadiusStyle,
          {
            backgroundColor: `rgba(255, 255, 255, ${GLASS_CONFIG.bubbleOpacity})`,
          },
        ]}
        pointerEvents="none"
      />

      {/* Spectrum gradient overlay - very subtle colorful tint */}
      <Animated.View
        style={[StyleSheet.absoluteFill, glassBorderRadiusStyle]}
        pointerEvents="none"
      >
        <LinearGradient
          colors={SPECTRUM_GRADIENT_COLORS as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Glass overlay with borders and subtle shadows */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          glassBorderRadiusStyle,
          {
            borderWidth: 1,
            borderColor: `rgba(255, 255, 255, ${GLASS_CONFIG.borderOpacity})`,
            // Very subtle shadow for depth - not blocking background
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 8,
            shadowOpacity: 0.08,
            elevation: 2, // Android shadow
          },
        ]}
        pointerEvents="none"
      />

      {/* Very subtle highlight effect at top */}
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: "absolute",
            top: 2,
            left: "30%",
            right: "30%",
            height: "25%",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderRadius: 10,
            opacity: 0.4,
          },
        ]}
      />
    </Animated.View>
  );
}

// Tab item component with layout measurement
interface TabItemProps {
  route: any;
  options: any;
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  colors: any;
  onLayout: (layout: ActiveTabLayout, index: number) => void;
  tabBarRef: React.RefObject<View | null>;
  tabIndex: number;
}

function TabItem({
  route,
  options,
  isFocused,
  onPress,
  onLongPress,
  colors,
  onLayout,
  tabBarRef,
  tabIndex,
}: TabItemProps) {
  // Remove scale animation - only use opacity for smooth fade
  const activeOpacity = useSharedValue(isFocused ? 1 : 0);
  const inactiveOpacity = useSharedValue(isFocused ? 0 : 1);
  const didMountRef = useRef(false);

  useEffect(() => {
    if (!didMountRef.current) {
      activeOpacity.value = isFocused ? 1 : 0;
      inactiveOpacity.value = isFocused ? 0 : 1;
      didMountRef.current = true;
      return;
    }

    // Smooth fade transition without zoom
    activeOpacity.value = withTiming(isFocused ? 1 : 0, { duration: 200 });
    inactiveOpacity.value = withTiming(isFocused ? 0 : 1, { duration: 200 });
  }, [isFocused, activeOpacity, inactiveOpacity]);

  const wrapperRef = useRef<View>(null);
  const layoutTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Trigger measurement when tab becomes focused
  useEffect(() => {
    if (isFocused && wrapperRef.current) {
      // Force measurement when tab becomes active
      // Small delay to ensure layout is ready
      const timer = setTimeout(() => {
        if (wrapperRef.current && tabBarRef.current && isFocused) {
          wrapperRef.current.measureLayout(
            tabBarRef.current,
            (wrapperX, wrapperY, wrapperWidth, wrapperHeight) => {
              if (
                wrapperX < 0 ||
                wrapperY < 0 ||
                wrapperWidth <= 0 ||
                wrapperHeight <= 0
              ) {
                return;
              }
              const circleWidth = 56;
              const circleHeight = 48;
              const circleX = wrapperX + (wrapperWidth - circleWidth) / 2;
              const circleY = wrapperY + (wrapperHeight - circleHeight) / 2;

              if (circleX >= 0 && circleY >= 0) {
                onLayout(
                  {
                    x: circleX,
                    y: circleY,
                    width: circleWidth,
                    height: circleHeight,
                  },
                  tabIndex
                );
              }
            },
            () => {}
          );
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isFocused, tabIndex, onLayout, tabBarRef]);

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      // Only measure when focused
      if (!isFocused) {
        return;
      }

      // Clear previous timeout
      if (layoutTimeoutRef.current) {
        clearTimeout(layoutTimeoutRef.current);
      }

      // Capture tabIndex in closure
      const currentTabIndex = tabIndex;
      const eventLayout = event.nativeEvent.layout;

      // Use a small delay to ensure layout is stable
      layoutTimeoutRef.current = setTimeout(() => {
        if (!isFocused) return; // Double check focus state

        // Measure wrapper position relative to tab bar, then calculate circle position
        // Circle is centered in the wrapper
        if (wrapperRef.current && tabBarRef.current) {
          wrapperRef.current.measureLayout(
            tabBarRef.current,
            (wrapperX, wrapperY, wrapperWidth, wrapperHeight) => {
              // Validate measurements
              if (
                wrapperX < 0 ||
                wrapperY < 0 ||
                wrapperWidth <= 0 ||
                wrapperHeight <= 0
              ) {
                return; // Invalid layout, don't update
              }

              // Active circle dimensions (from styles - activeTabCircle)
              const circleWidth = 56; // minWidth from styles
              const circleHeight = 48; // minHeight from styles
              // Center the circle in the wrapper
              const circleX = wrapperX + (wrapperWidth - circleWidth) / 2;
              const circleY = wrapperY + (wrapperHeight - circleHeight) / 2;

              // Update layout - bubble will use these coordinates directly
              if (circleX >= 0 && circleY >= 0) {
                onLayout(
                  {
                    x: circleX,
                    y: circleY,
                    width: circleWidth,
                    height: circleHeight,
                  },
                  currentTabIndex
                );
              }
            },
            () => {
              // Fallback: use event layout and estimate circle position
              const { x, y, width, height } = eventLayout;

              // Validate event layout
              if (x < 0 || y < 0 || width <= 0 || height <= 0) {
                return; // Invalid layout
              }

              const circleWidth = 56;
              const circleHeight = 48;
              const circleX = x + (width - circleWidth) / 2;
              const circleY = y + (height - circleHeight) / 2;

              // Update layout with fallback position
              if (circleX >= 0 && circleY >= 0) {
                onLayout(
                  {
                    x: circleX,
                    y: circleY,
                    width: circleWidth,
                    height: circleHeight,
                  },
                  currentTabIndex
                );
              }
            }
          );
        }
      }, 100);
    },
    [onLayout, isFocused, tabBarRef, tabIndex]
  );

  // Only measure layout when tab is focused
  // Don't clear layout when unfocused - let bubble stay and animate

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (layoutTimeoutRef.current) {
        clearTimeout(layoutTimeoutRef.current);
      }
    };
  }, []);

  const animatedCircleStyle = useAnimatedStyle(() => {
    const opacity = activeOpacity.value;

    // No scale transform - transparent background to show liquid glass bubble
    // Liquid glass bubble provides the visual effect, active circle is just for icon/label
    return {
      opacity: opacity,
      // No background color - let liquid glass bubble show through
      backgroundColor: "transparent",
    };
  });

  const animatedInactiveStyle = useAnimatedStyle(() => {
    return {
      opacity: inactiveOpacity.value,
    };
  });

  const label =
    options.tabBarLabel !== undefined
      ? options.tabBarLabel
      : options.title !== undefined
      ? options.title
      : route.name;

  const activeIconColor = colors.accent;
  const inactiveIconColor = colors.mutedForeground;
  const iconSize = 24;

  const getIconElement = (focused: boolean, size: number, color: string) => {
    if (options.tabBarIcon) {
      if (typeof options.tabBarIcon === "function") {
        return options.tabBarIcon({
          focused,
          color,
          size,
        });
      }
      return options.tabBarIcon;
    }
    const iconName =
      typeof label === "string"
        ? (label.toLowerCase().replace(/\s+/g, ".") as any)
        : "circle";
    return <IconSymbol name={iconName} size={size} color={color} />;
  };

  return (
    <View
      ref={wrapperRef}
      onLayout={handleLayout}
      style={styles.tabItemWrapper}
      collapsable={false}
    >
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        activeOpacity={0.9}
        style={styles.tabItemContainer}
      >
        {/* Inactive Icon */}
        <Animated.View
          style={[styles.inactiveContainer, animatedInactiveStyle]}
          pointerEvents="none"
        >
          {getIconElement(false, iconSize, inactiveIconColor)}
        </Animated.View>

        {/* Active State */}
        <Animated.View
          pointerEvents="none"
          style={[styles.activeTabCircle, animatedCircleStyle]}
        >
          {getIconElement(true, 24, activeIconColor)}
          {typeof label === "string" && label.length > 0 && (
            <Text style={[styles.tabLabel, { color: activeIconColor }]}>
              {label}
            </Text>
          )}
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

export interface GlassTabBarProps extends BottomTabBarProps {
  tabBarTheme?: TabBarTheme; // Optional theme prop for tab bar colors
}

export function GlassTabBar({
  state,
  descriptors,
  navigation,
  tabBarTheme = "blue", // Default to blue theme (like in the image)
}: GlassTabBarProps) {
  const { colors, theme } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const isDark = theme === "dark";
  const insets = useSafeAreaInsets();
  const tabBarRef = useRef<View>(null);

  const [activeTabLayout, setActiveTabLayout] =
    useState<ActiveTabLayout | null>(null);
  const activeIndex = state.index;

  // Initialize with first tab layout if available
  useEffect(() => {
    // Try to get layout for current active tab after a delay to allow measurement
    const timer = setTimeout(() => {
      // This will be set by handleActiveTabLayout when measurement completes
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Track layouts for all tabs to enable smooth transitions
  const tabLayoutsRef = useRef<Map<number, ActiveTabLayout>>(new Map());

  const handleActiveTabLayout = useCallback(
    (layout: ActiveTabLayout, index: number) => {
      // Store layout for this tab in ref (persists across renders)
      if (layout && layout.width > 20 && layout.height > 20) {
        tabLayoutsRef.current.set(index, layout);

        // If this is the active tab, update activeTabLayout immediately
        if (state.index === index) {
          setActiveTabLayout(layout);
        }
      }
    },
    [state.index]
  );

  // Update activeTabLayout when active index changes
  // This triggers the slide animation
  useEffect(() => {
    const currentLayout = tabLayoutsRef.current.get(state.index);
    if (currentLayout) {
      // Update layout - bubble will smoothly slide from current position to new position
      setActiveTabLayout((prevLayout) => {
        // Only update if layout actually changed
        if (
          prevLayout &&
          prevLayout.x === currentLayout.x &&
          prevLayout.y === currentLayout.y &&
          prevLayout.width === currentLayout.width &&
          prevLayout.height === currentLayout.height
        ) {
          return prevLayout; // Same position, no animation needed
        }
        return currentLayout; // New position, trigger slide animation
      });
    }
    // IMPORTANT: If layout not yet measured, DON'T clear activeTabLayout
    // Keep the previous layout so bubble stays visible at current position
    // Layout will be updated when measurement completes via handleActiveTabLayout
  }, [state.index]);

  const handleTabPress = useCallback(
    (route: any, isFocused: boolean) => {
      const event = navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });
      if (!isFocused && !event.defaultPrevented) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        navigation.navigate(route.name, route.params);
      }
    },
    [navigation]
  );

  // Calculate pill-shaped tab bar dimensions
  const bottomMargin = Math.max(
    insets.bottom + GLASS_CONFIG.bottomMargin,
    GLASS_CONFIG.bottomMargin
  );
  const tabBarWidth = screenWidth - GLASS_CONFIG.horizontalMargin * 2;
  const pillBorderRadius = GLASS_CONFIG.tabBarHeight / 2; // Perfect pill shape

  const containerStyle = useMemo(
    () => ({
      position: "absolute" as const,
      bottom: bottomMargin,
      left: GLASS_CONFIG.horizontalMargin,
      right: GLASS_CONFIG.horizontalMargin,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      height: GLASS_CONFIG.tabBarHeight, // Strict height limit to prevent blur from extending
      overflow: "hidden" as const, // Clip blur effect to container bounds
    }),
    [bottomMargin]
  );

  const tabBarStyle = useMemo(
    () => ({
      flexDirection: "row" as const,
      paddingVertical: 8,
      paddingHorizontal: 6,
      justifyContent: "space-around" as const,
      position: "relative" as const,
      width: tabBarWidth,
      height: GLASS_CONFIG.tabBarHeight,
      overflow: "hidden" as const, // Clip bubble to tab bar bounds
      borderRadius: pillBorderRadius,
    }),
    [tabBarWidth, pillBorderRadius]
  );

  return (
    <View style={containerStyle}>
      {/* Pill-shaped tab bar container */}
      <View ref={tabBarRef} style={tabBarStyle}>
        {/* Enhanced glass morphism background */}
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <BlurView
            intensity={GLASS_CONFIG.blurIntensity}
            tint={isDark ? "dark" : "light"}
            style={[
              StyleSheet.absoluteFill,
              { borderRadius: pillBorderRadius },
            ]}
          />
        </View>

        {/* Overlay layers for glass effect - Transparent white background */}
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: isDark
                ? `rgba(20, 20, 20, ${GLASS_CONFIG.overlayOpacity})` // Dark transparent for dark mode
                : `rgba(255, 255, 255, ${GLASS_CONFIG.overlayOpacity})`, // Transparent white to show content below
              borderRadius: pillBorderRadius,
            },
          ]}
          pointerEvents="none" // Don't block touch events
        />

        {/* Glass border - Theme-based border color - Subtle and transparent */}
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              borderRadius: pillBorderRadius,
              borderWidth: 1,
              borderColor: TAB_BAR_THEMES[tabBarTheme].border,
            },
          ]}
          pointerEvents="none" // Don't block touch events
        />

        {/* Liquid glass bubble - Render FIRST with low z-index (stays behind) */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: GLASS_CONFIG.tabBarHeight, // Strict height limit
            overflow: "hidden", // Clip any overflow
            borderRadius: pillBorderRadius, // Match tab bar border radius
            zIndex: 1, // Below tab items (zIndex: 20+)
          }}
          pointerEvents="none" // Don't block touch events - let them pass through to tab items
        >
          <LiquidGlassBubble
            layout={activeTabLayout}
            isActive={state.index === activeIndex}
          />
        </View>

        {/* Tab items - Render LAST with high z-index (stays on top) */}
        {state.routes
          .filter((route) => {
            const { options } = descriptors[route.key];
            // List of routes that should be hidden from tab bar
            const hiddenRoutes = ['profile', 'radio', 'search'];
            
            // Hide routes by name (most reliable way)
            if (hiddenRoutes.includes(route.name)) {
              return false;
            }
            
            // Also hide routes with href: null (expo-router way)
            if (options.href === null) {
              return false;
            }
            
            return true;
          })
          .map((route, visibleIndex) => {
            const { options } = descriptors[route.key];
            const originalIndex = state.routes.findIndex((r) => r.key === route.key);
            const isFocused = state.index === originalIndex;
            const onPress = () => handleTabPress(route, isFocused);
            const onLongPress = () => {
              navigation.emit({ type: "tabLongPress", target: route.key });
            };
            return (
              <TabItem
                key={route.key}
                route={route}
                options={options}
                isFocused={isFocused}
                onPress={onPress}
                onLongPress={onLongPress}
                colors={colors}
                onLayout={handleActiveTabLayout}
                tabBarRef={tabBarRef}
                tabIndex={visibleIndex}
              />
            );
          })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabItemWrapper: {
    flex: 1,
    position: "relative",
    zIndex: 20, // High z-index to ensure tab items are always above bubble
  },
  tabItemContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    paddingVertical: 8,
    minHeight: 48,
    zIndex: 20, // High z-index - ensure container is above bubble
    elevation: 10, // Android elevation to ensure it's on top
  },
  inactiveContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    zIndex: 21, // Above bubble
    elevation: 11, // Android elevation
  },
  activeTabCircle: {
    position: "absolute",
    minWidth: 56,
    minHeight: 48,
    borderRadius: 24,
    backgroundColor: "transparent", // Transparent to show liquid glass bubble
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    zIndex: 25, // Very high - ensure icon and text are clearly visible above bubble
    elevation: 15, // Android elevation - ensure it's on top
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
    // Ensure text is clearly visible with subtle shadow
    textShadowColor: "rgba(255, 255, 255, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
