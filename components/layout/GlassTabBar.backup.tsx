/**
 * GlassTabBar Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Custom bottom tab bar with glass morphism effect and liquid blob animation.
 * Designed to work with Expo Router Tabs.
 */

import { useTheme } from "heroui-native";
import { View, TouchableOpacity, type ViewStyle, StyleSheet, useWindowDimensions, Text, type LayoutChangeEvent } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useEffect, useRef, useState, useCallback } from "react";
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

// Active tab layout info - for white circle background
interface ActiveTabLayout {
  x: number; // Center x of white circle (relative to tab bar)
  y: number; // Center y of white circle (relative to tab bar)
  width: number; // Width of white circle
  height: number; // Height of white circle
}

// Liquid glass bubble component - uses actual tab layout measurements
function LiquidGlassBubble({
  layout,
  color,
  isActive,
}: {
  layout: ActiveTabLayout | null;
  color: string;
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
      animatedX.value = withSpring(layout.x, {
        damping: 20,
        stiffness: 180,
      });
      animatedY.value = withSpring(layout.y, {
        damping: 20,
        stiffness: 180,
      });
      animatedWidth.value = withSpring(layout.width, {
        damping: 20,
        stiffness: 180,
      });
      animatedHeight.value = withSpring(layout.height, {
        damping: 20,
        stiffness: 180,
      });
    }
  }, [layout, animatedX, animatedY, animatedWidth, animatedHeight]);

  useEffect(() => {
    if (isActive && layout) {
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 150,
      });
      opacity.value = withTiming(1, { duration: 300 }); // Full opacity when active
    } else {
      scale.value = withTiming(0, { duration: 200 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [isActive, layout, scale, opacity]);

  const glowStyle = useAnimatedStyle(() => {
    const glowOpacity = interpolate(
      scale.value,
      [0, 1],
      [0, 0.2],
      Extrapolate.CLAMP
    );
    
    return {
      opacity: glowOpacity,
    };
  });

  if (!layout) {
    return null;
  }

  // Bubble is outer glow around white circle - larger than white circle
  const bubblePadding = 12; // Padding around white circle for outer glow

  const bubbleAnimatedStyle = useAnimatedStyle(() => {
    if (!layout) {
      return { opacity: 0 };
    }

    // Calculate bubble size from white circle size + padding
    const bubbleWidth = animatedWidth.value + (bubblePadding * 2);
    const bubbleHeight = animatedHeight.value + (bubblePadding * 2);
    const borderRadius = Math.min(bubbleWidth, bubbleHeight) / 2; // Perfect pill shape

    return {
      left: animatedX.value - bubblePadding,
      top: animatedY.value - bubblePadding,
      width: bubbleWidth,
      height: bubbleHeight,
      borderRadius,
      transform: [
        { scale: scale.value },
      ],
      opacity: opacity.value,
    };
  });

  return (
    <>
      {/* Subtle shadow - no color glow, just soft shadow */}
      <Animated.View
        style={[
          {
            position: "absolute",
            backgroundColor: "transparent",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 8,
            shadowOpacity: 0.1, // Very subtle shadow
            zIndex: 4, // Below bubble, above background
          },
          bubbleAnimatedStyle, // borderRadius is included here
        ]}
      />

      {/* Main glass bubble - outer glow around white circle */}
      <Animated.View
        style={[
          {
            position: "absolute",
            overflow: "hidden",
            zIndex: 5, // Above background (zIndex: 0), below tab items (zIndex: 10)
          },
          bubbleAnimatedStyle,
        ]}
      >
        {Platform.OS === "ios" ? (
          // Use native Liquid Glass on iOS with expo-liquid-glass-view
          // Use "clear" type for transparent glass bubble effect
          <GlassViewNative
            type="clear"
            cornerStyle="circular"
            style={StyleSheet.absoluteFill}
            borderRadius={Math.min(layout.width + 24, layout.height + 24) / 2}
          >
            {/* Light overlay - much more visible */}
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  borderRadius: Math.min(layout.width + 24, layout.height + 24) / 2,
                  backgroundColor: "rgba(150, 150, 150, 0.7)", // Much more visible gray tint
                },
              ]}
            />
            
            {/* White border for better definition */}
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  borderRadius: Math.min(layout.width + 24, layout.height + 24) / 2,
                  borderWidth: 2.5,
                  borderColor: "rgba(255, 255, 255, 1)", // Fully opaque border
                },
              ]}
            />
          </GlassViewNative>
        ) : (
          // Fallback to expo-blur for Android/Web
          <>
            <BlurView
              intensity={50}
              tint="light"
              style={StyleSheet.absoluteFill}
            />
            
            {/* Light glass overlay - much more visible */}
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: "rgba(150, 150, 150, 0.7)", // Much more visible
                  borderRadius: Math.min(layout.width + 24, layout.height + 24) / 2,
                },
              ]}
            />

            {/* White border for better definition */}
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  borderRadius: Math.min(layout.width + 24, layout.height + 24) / 2,
                  borderWidth: 2.5,
                  borderColor: "rgba(255, 255, 255, 1)", // Fully opaque border
                },
              ]}
            />
          </>
        )}
      </Animated.View>
    </>
  );
}

// Tab item component with layout measurement
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
  const scale = useSharedValue(isFocused ? 1 : 0.9);
  const opacity = useSharedValue(isFocused ? 1 : 0.7);
  const tabItemRef = useRef<View>(null);
  const whiteCircleRef = useRef<View>(null); // Ref for white circle background

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1.05 : 0.9, {
      damping: 18,
      stiffness: 200,
    });
    opacity.value = withTiming(isFocused ? 1 : 0.7, { duration: 200 });
  }, [isFocused, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
      ],
      opacity: opacity.value,
    };
  });

  // Measure white circle layout (for active tab)
  const measureWhiteCircleLayout = useCallback(() => {
    if (!whiteCircleRef.current || !tabBarRef.current || !isFocused) return;
    
    tabBarRef.current.measureInWindow((tabBarX, tabBarY, tabBarWidth, tabBarHeight) => {
      whiteCircleRef.current?.measureInWindow((circleX, circleY, circleWidth, circleHeight) => {
        // Calculate center position of white circle relative to tab bar
        const centerX = (circleX - tabBarX) + (circleWidth / 2);
        const centerY = (circleY - tabBarY) + (circleHeight / 2);
        
        const layout: ActiveTabLayout = {
          x: centerX - (circleWidth / 2), // Left position (for absolute positioning)
          y: centerY - (circleHeight / 2), // Top position (for absolute positioning)
          width: circleWidth,
          height: circleHeight,
        };
        onLayout(layout);
      });
    });
  }, [onLayout, tabBarRef, isFocused]);

  const handleWhiteCircleLayout = useCallback((event: LayoutChangeEvent) => {
    if (!isFocused || !tabBarRef.current) return;
    
    const { x, y, width, height } = event.nativeEvent.layout;
    
    // Calculate center position relative to tab bar
    tabBarRef.current.measureInWindow((tabBarX, tabBarY) => {
      // x, y from onLayout are relative to parent (TabItem)
      // We need to get absolute position of white circle
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

  // Measure white circle layout when tab becomes focused
  useEffect(() => {
    if (isFocused) {
      // Delay to ensure layout is ready
      const timer = setTimeout(() => {
        measureWhiteCircleLayout();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isFocused, measureWhiteCircleLayout]);

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
          size: isFocused ? 26 : 22,
        })
      : options.tabBarIcon
    : null;

  return (
    <Animated.View
      ref={tabItemRef}
      collapsable={false}
      style={[
        {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 6,
          paddingHorizontal: 12,
          position: "relative",
          zIndex: isFocused ? 10 : 1,
        },
        animatedStyle,
      ]}
    >
      <View
        ref={whiteCircleRef}
        onLayout={handleWhiteCircleLayout}
        collapsable={false}
        style={{
          // White circular background for active tab
          ...(isFocused && {
            backgroundColor: "white",
            borderRadius: 28, // Circular background
            paddingVertical: 10,
            paddingHorizontal: 16,
            minWidth: 56, // Fixed size for white circle
            minHeight: 56,
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
          {iconElement || (
            <IconSymbol
              name={typeof label === "string" ? label.toLowerCase().replace(/\s+/g, ".") : "circle"}
              size={isFocused ? 26 : 22}
              color={isFocused ? colors.accent : colors.mutedForeground}
            />
          )}
          
          {/* Tab label - hide if empty (like Search tab in image) */}
          {typeof label === "string" && label.length > 0 && (
            <Text
              style={{
                fontSize: isFocused ? 11 : 10,
                fontWeight: isFocused ? "600" : "400",
                color: isFocused ? colors.accent : colors.mutedForeground,
                marginTop: 2,
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

  // Get active route index
  const activeIndex = state.index;
  const routes = state.routes;

  // State to store active tab layout
  const [activeTabLayout, setActiveTabLayout] = useState<ActiveTabLayout | null>(null);

  // Callback to update active tab layout
  const handleActiveTabLayout = useCallback((layout: ActiveTabLayout) => {
    // Only update if layout is valid
    if (layout && layout.width > 0 && layout.height > 0) {
      setActiveTabLayout(layout);
    }
  }, []);

  // Initialize layout for active tab on mount
  useEffect(() => {
    if (activeIndex >= 0 && !activeTabLayout) {
      // Force measurement after a short delay
      const timer = setTimeout(() => {
        // This will be handled by TabItem's measureLayout
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [activeIndex, activeTabLayout]);

  const blurTint: "light" | "dark" | "default" = isDark ? "dark" : "light";

  // Get safe area insets for proper spacing
  const insets = useSafeAreaInsets();
  
  // Nav bar container - floating, cách bottom một chút, có margin hai bên
  const bottomMargin = Math.max(insets.bottom, 12); // Cách bottom ít nhất 12px
  const horizontalMargin = 16; // Margin hai bên
  
  const tabBarContainerStyle: ViewStyle = {
    position: "absolute",
    bottom: bottomMargin, // Cách bottom một chút
    left: horizontalMargin,   // Margin trái
    right: horizontalMargin,  // Margin phải
    alignItems: "center",
    justifyContent: "center",
  };

  // Nav bar style - bo tròn tất cả corners (pill shape)
  const tabBarWidth = screenWidth - (horizontalMargin * 2);
  const tabBarBorderRadius = 28; // Bo tròn tất cả corners
  
  const tabBarStyle: ViewStyle = {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 12,
    justifyContent: "space-around",
    position: "relative",
    width: tabBarWidth,
    minHeight: 70,
    overflow: "visible",
    borderRadius: tabBarBorderRadius, // Bo tròn tất cả corners
  };

  const handleTabPress = (route: any, isFocused: boolean, index: number) => {
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      // Haptic feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      navigation.navigate(route.name, route.params);
    }
  };

  return (
    <View style={tabBarContainerStyle}>
      <View 
        style={[
          tabBarStyle,
          {
            // Shadow for floating effect
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDark ? 0.3 : 0.15,
            shadowRadius: 16,
            elevation: 12, // Android shadow
          },
        ]} 
        ref={tabBarRef}
      >
      {/* Glass blur background for entire tab bar - bo tròn tất cả corners (pill shape) */}
      <BlurView
        intensity={20}
        tint={blurTint}
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius: tabBarBorderRadius,
          },
        ]}
      />
      
      {/* Glass overlay - lighter for better glass effect */}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: isDark 
              ? `rgba(30, 30, 30, 0.5)` 
              : `rgba(255, 255, 255, 0.6)`,
            borderRadius: tabBarBorderRadius,
          },
        ]}
        pointerEvents="none"
      />

      {/* Liquid glass bubble - outer glow around white circle */}
      {activeIndex >= 0 && activeTabLayout && (
        <LiquidGlassBubble
          layout={activeTabLayout}
          color={colors.accent} // Not used for bubble color, only for potential accent hints
          isActive={activeTabLayout !== null}
        />
      )}

      {/* Tab items - above background and bubble */}
      {routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => handleTabPress(route, isFocused, index);
        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
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
          />
        );
      })}
      </View>
    </View>
  );
}

