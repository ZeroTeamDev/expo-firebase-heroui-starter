/**
 * LiquidGlassTabBar V2 - Premium iOS Style
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Recreates the liquid glass effect from the reference image.
 * Features:
 * - Continuous rounded pill shape
 * - Strong blur with high transparency
 * - Liquid blob animation between tabs
 * - iOS native liquid glass view support
 */

import { useTheme } from "heroui-native";
import {
  View,
  TouchableOpacity,
  type ViewStyle,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
  withSpring,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { GlassViewNative } from "@/components/glass/GlassViewNative";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

// Premium config matching reference image
const LIQUID_GLASS_CONFIG = {
  // Tab bar dimensions
  tabBarHeight: 80, // Taller for premium look
  borderRadius: 40, // Perfect pill shape
  horizontalMargin: 12, // Closer to edges
  bottomMargin: 12, // Floating above bottom

  // Glass effect
  blurIntensity: 100, // Maximum blur for liquid glass
  overlayOpacity: 0.15, // Very transparent

  // White circle indicator
  circleSize: 62, // Large white circle
  circlePadding: 10, // Space inside circle

  // Liquid blob
  blobPadding: 8, // Tight around white circle
  blobOpacity: 0.15, // Subtle accent glow

  // Animation
  springConfig: {
    damping: 28,
    stiffness: 220,
    mass: 0.4,
  },
};

interface ActiveTabLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Liquid blob that morphs between tabs
function LiquidBlob({
  layout,
  accentColor,
}: {
  layout: ActiveTabLayout | null;
  accentColor: string;
}) {
  const animatedX = useSharedValue(layout?.x || 0);
  const animatedY = useSharedValue(layout?.y || 0);
  const animatedWidth = useSharedValue(layout?.width || 0);
  const animatedHeight = useSharedValue(layout?.height || 0);
  const scale = useSharedValue(layout ? 1 : 0);

  useEffect(() => {
    if (layout) {
      animatedX.value = withSpring(layout.x, LIQUID_GLASS_CONFIG.springConfig);
      animatedY.value = withSpring(layout.y, LIQUID_GLASS_CONFIG.springConfig);
      animatedWidth.value = withSpring(layout.width, LIQUID_GLASS_CONFIG.springConfig);
      animatedHeight.value = withSpring(layout.height, LIQUID_GLASS_CONFIG.springConfig);
      scale.value = withSpring(1, LIQUID_GLASS_CONFIG.springConfig);
    } else {
      scale.value = withTiming(0, { duration: 200 });
    }
  }, [layout, animatedX, animatedY, animatedWidth, animatedHeight, scale]);

  const blobStyle = useAnimatedStyle(() => {
    const blobWidth = animatedWidth.value + (LIQUID_GLASS_CONFIG.blobPadding * 2);
    const blobHeight = animatedHeight.value + (LIQUID_GLASS_CONFIG.blobPadding * 2);

    return {
      position: "absolute",
      left: animatedX.value - LIQUID_GLASS_CONFIG.blobPadding,
      top: animatedY.value - LIQUID_GLASS_CONFIG.blobPadding,
      width: blobWidth,
      height: blobHeight,
      borderRadius: Math.min(blobWidth, blobHeight) / 2,
      backgroundColor: `${accentColor}${Math.round(LIQUID_GLASS_CONFIG.blobOpacity * 255).toString(16).padStart(2, '0')}`,
      transform: [{ scale: scale.value }],
      zIndex: 5,
    };
  });

  if (!layout) return null;

  return <Animated.View style={blobStyle} />;
}

// Individual tab item
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
  onLayout: (layout: ActiveTabLayout | null) => void;
  tabBarRef: React.RefObject<View>;
}) {
  const scale = useSharedValue(isFocused ? 1 : 0.88);
  const iconScale = useSharedValue(isFocused ? 1 : 0.92);
  const circleRef = useRef<View>(null);

  useEffect(() => {
    scale.value = withSpring(
      isFocused ? 1 : 0.88,
      LIQUID_GLASS_CONFIG.springConfig
    );
    iconScale.value = withSpring(
      isFocused ? 1.05 : 0.92,
      {
        damping: 22,
        stiffness: 200,
      }
    );
  }, [isFocused, scale, iconScale]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: interpolate(scale.value, [0.88, 1], [0.6, 1], Extrapolate.CLAMP),
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  // Measure white circle position
  const measureLayout = useCallback(() => {
    if (!isFocused || !circleRef.current || !tabBarRef.current) return;

    setTimeout(() => {
      tabBarRef.current?.measureInWindow((tabBarX, tabBarY) => {
        circleRef.current?.measureInWindow((circleX, circleY, circleWidth, circleHeight) => {
          if (circleWidth > 0 && circleHeight > 0) {
            const layout: ActiveTabLayout = {
              x: circleX - tabBarX,
              y: circleY - tabBarY,
              width: circleWidth,
              height: circleHeight,
            };
            onLayout(layout);
          }
        });
      });
    }, 50);
  }, [isFocused, onLayout, tabBarRef]);

  useEffect(() => {
    if (isFocused) {
      measureLayout();
    } else {
      onLayout(null);
    }
  }, [isFocused, measureLayout, onLayout]);

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
          color: isFocused ? colors.foreground : colors.mutedForeground,
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
          position: "relative",
          zIndex: isFocused ? 10 : 1,
        },
        containerStyle,
      ]}
    >
      {/* White circle for active tab */}
      <View
        ref={circleRef}
        collapsable={false}
        style={{
          ...(isFocused && {
            backgroundColor: "white",
            width: LIQUID_GLASS_CONFIG.circleSize,
            height: LIQUID_GLASS_CONFIG.circleSize,
            borderRadius: LIQUID_GLASS_CONFIG.circleSize / 2,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 10,
            shadowOpacity: 0.15,
            elevation: 4,
          }),
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          onPress={onPress}
          onLongPress={onLongPress}
          activeOpacity={0.7}
          style={{
            padding: LIQUID_GLASS_CONFIG.circlePadding,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Animated.View style={iconAnimatedStyle}>
            {iconElement || (
              <IconSymbol
                name={typeof label === "string" ? label.toLowerCase() : "circle"}
                size={isFocused ? 28 : 24}
                color={isFocused ? colors.foreground : colors.mutedForeground}
              />
            )}
          </Animated.View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

export function LiquidGlassTabBarV2({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors, theme } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const isDark = theme === "dark";
  const tabBarRef = useRef<View>(null);
  const insets = useSafeAreaInsets();

  const [activeTabLayout, setActiveTabLayout] = useState<ActiveTabLayout | null>(null);

  const handleTabLayout = useCallback((layout: ActiveTabLayout | null) => {
    setActiveTabLayout(layout);
  }, []);

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

  const bottomMargin = Math.max(
    insets.bottom + LIQUID_GLASS_CONFIG.bottomMargin,
    LIQUID_GLASS_CONFIG.bottomMargin
  );

  const tabBarWidth = screenWidth - LIQUID_GLASS_CONFIG.horizontalMargin * 2;

  const containerStyle: ViewStyle = useMemo(
    () => ({
      position: "absolute",
      bottom: bottomMargin,
      left: LIQUID_GLASS_CONFIG.horizontalMargin,
      right: LIQUID_GLASS_CONFIG.horizontalMargin,
      alignItems: "center",
      justifyContent: "center",
    }),
    [bottomMargin]
  );

  const tabBarStyle: ViewStyle = useMemo(
    () => ({
      flexDirection: "row",
      paddingVertical: 6,
      paddingHorizontal: 4,
      justifyContent: "space-around",
      alignItems: "center",
      position: "relative",
      width: tabBarWidth,
      height: LIQUID_GLASS_CONFIG.tabBarHeight,
      borderRadius: LIQUID_GLASS_CONFIG.borderRadius,
      overflow: "hidden",
    }),
    [tabBarWidth]
  );

  const blurTint: "light" | "dark" = isDark ? "dark" : "light";

  return (
    <View style={containerStyle}>
      <View
        style={[
          tabBarStyle,
          {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: isDark ? 0.5 : 0.15,
            shadowRadius: 24,
            elevation: 12,
          },
        ]}
        ref={tabBarRef}
      >
        {/* Premium blur background */}
        {Platform.OS === "ios" ? (
          <GlassViewNative
            type="regular"
            cornerStyle="continuous"
            blurIntensity={LIQUID_GLASS_CONFIG.blurIntensity}
            opacity={1 - LIQUID_GLASS_CONFIG.overlayOpacity}
            borderRadius={LIQUID_GLASS_CONFIG.borderRadius}
            style={StyleSheet.absoluteFill}
          />
        ) : (
          <BlurView
            intensity={LIQUID_GLASS_CONFIG.blurIntensity}
            tint={blurTint}
            style={StyleSheet.absoluteFill}
          />
        )}

        {/* Very light overlay for glass effect */}
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: isDark
                ? `rgba(30, 30, 30, ${LIQUID_GLASS_CONFIG.overlayOpacity})`
                : `rgba(255, 255, 255, ${LIQUID_GLASS_CONFIG.overlayOpacity})`,
            },
          ]}
          pointerEvents="none"
        />

        {/* Subtle border */}
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              borderRadius: LIQUID_GLASS_CONFIG.borderRadius,
              borderWidth: 0.5,
              borderColor: isDark
                ? "rgba(255, 255, 255, 0.12)"
                : "rgba(255, 255, 255, 0.4)",
            },
          ]}
          pointerEvents="none"
        />

        {/* Liquid blob indicator */}
        {activeTabLayout && (
          <LiquidBlob layout={activeTabLayout} accentColor={colors.accent} />
        )}

        {/* Tab items */}
        {state.routes.map((route, index) => {
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
              onLayout={handleTabLayout}
              tabBarRef={tabBarRef}
            />
          );
        })}
      </View>
    </View>
  );
}
