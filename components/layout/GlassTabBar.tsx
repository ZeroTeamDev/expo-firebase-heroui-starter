/**
 * GlassTabBar Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Custom bottom tab bar with glass morphism effect and liquid blob animation.
 * Designed to work with Expo Router Tabs.
 */

import { useTheme } from "heroui-native";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Platform,
} from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useEffect } from "react";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { GlassViewNative } from "@/components/glass/GlassViewNative";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

// Tab item component with layout measurement
function TabItem({
  route,
  options,
  isFocused,
  onPress,
  onLongPress,
  colors,
}: {
  route: any;
  options: any;
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  colors: any;
}) {
  const scale = useSharedValue(isFocused ? 1 : 0);
  const inactiveOpacity = useSharedValue(isFocused ? 0 : 1);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0, {
      damping: 18,
      stiffness: 180,
    });
    inactiveOpacity.value = withTiming(isFocused ? 0 : 1, { duration: 200 });
  }, [isFocused, scale, inactiveOpacity]);

  const animatedCircleStyle = useAnimatedStyle(() => {
    const s = scale.value;

    // Hard cutoff: if scale is very small (inactive), force everything to 0
    if (s < 0.05) {
      return {
        transform: [{ scale: 0 }],
        opacity: 0,
        shadowOpacity: 0,
        backgroundColor: "rgba(255,255,255,0)",
      };
    }

    // Otherwise, animate normally
    const bgAlpha = interpolate(s, [0.05, 0.5, 1], [0, 0.8, 1]);
    return {
      transform: [{ scale: s }],
      opacity: interpolate(s, [0.05, 0.5, 1], [0, 0, 1]),
      shadowOpacity: interpolate(s, [0.05, 0.5, 1], [0, 0, 0.12]),
      backgroundColor: `rgba(255,255,255,${bgAlpha})`,
    };
  });

  const animatedInactiveStyle = useAnimatedStyle(() => {
    // Fade out inactive icon when circle scales in.
    return {
      opacity: interpolate(scale.value, [0, 0.5, 1], [1, 1, 0]),
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

  // Get icon element - always render with fallback
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
    // Fallback icon if no tabBarIcon provided
    const iconName =
      typeof label === "string"
        ? (label.toLowerCase().replace(/\s+/g, ".") as any)
        : "circle";
    return <IconSymbol name={iconName} size={size} color={color} />;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.9}
      style={styles.tabItemContainer}
    >
      {/* Inactive Icon - Fades out. Always rendered. */}
      <Animated.View
        style={[styles.inactiveContainer, animatedInactiveStyle]}
        pointerEvents="none"
      >
        {getIconElement(false, iconSize, inactiveIconColor)}
      </Animated.View>

      {/* Active State (Circle + Icon + Label) - Scales in. Always rendered. */}
      <Animated.View
        pointerEvents="none"
        style={[styles.activeTabCircle, animatedCircleStyle]}
      >
        {getIconElement(true, 22, activeIconColor)}
        {typeof label === "string" && label.length > 0 && (
          <Text style={[styles.tabLabel, { color: activeIconColor }]}>
            {label}
          </Text>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

export function GlassTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { colors, theme } = useTheme();
  const isDark = theme === "dark";
  const insets = useSafeAreaInsets();
  const bottomPadding = insets.bottom > 0 ? insets.bottom : 12;

  const handleTabPress = (route: any, isFocused: boolean) => {
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });
    if (!isFocused && !event.defaultPrevented) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      navigation.navigate(route.name, route.params);
    }
  };

  return (
    <View
      style={[
        styles.tabBarContainer,
        { paddingBottom: insets.bottom, height: 50 + bottomPadding },
      ]}
    >
      {/* Use BlurView for background on all platforms to avoid native artifact */}
      <BlurView
        intensity={30}
        tint={isDark ? "dark" : "light"}
        style={StyleSheet.absoluteFillObject}
      />
      <View
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: isDark
              ? "rgba(30, 30, 30, 0.6)"
              : "rgba(255, 255, 255, 0.75)",
          },
        ]}
      />
      <View style={styles.tabBarContent}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
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
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 0,
    elevation: 0,
    backgroundColor: "transparent",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  tabBarContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 10,
  },
  tabItemContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    paddingVertical: 4,
    minHeight: 60,
  },
  inactiveContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    zIndex: 2,
  },
  activeTabCircle: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 5,
    zIndex: 1,
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
  },
});
