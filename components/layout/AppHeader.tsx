/**
 * AppHeader Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Main app header with glass morphism effect, search, theme toggle, and profile
 */

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { useTheme } from "heroui-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, usePathname } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { BlurView } from "expo-blur";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ThemeToggle } from "./ThemeToggle";
import { ProfileDropdown } from "./ProfileDropdown";
import { SearchCommandBar } from "./SearchCommandBar";
import { NotificationIcon } from "./NotificationIcon";

export interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  showSearch?: boolean;
  onSearchPress?: () => void;
  showProfile?: boolean;
  showThemeToggle?: boolean;
  showNotifications?: boolean;
  onNotificationPress?: () => void;
  rightActions?: React.ReactNode;
  blurIntensity?: number;
  opacity?: number;
}

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

export function AppHeader({
  title,
  showBack,
  onBackPress,
  showSearch = true,
  onSearchPress,
  showProfile = true,
  showThemeToggle = true,
  showNotifications = true,
  onNotificationPress,
  rightActions,
  blurIntensity = 30,
  opacity = 0.75,
}: AppHeaderProps) {
  const { colors, theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const [searchVisible, setSearchVisible] = useState(false);

  const isDark = theme === "dark";
  const scale = useSharedValue(1);

  // Determine if we can go back
  const canGoBack = router.canGoBack();
  const shouldShowBack = showBack !== undefined ? showBack : canGoBack;

  // Get title from route if not provided
  const displayTitle = title || getTitleFromRoute(pathname);

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else if (canGoBack) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      router.back();
    }
  };

  const handleSearchPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onSearchPress) {
      onSearchPress();
    } else {
      setSearchVisible(true);
    }
  };

  const handleSearch = (query: string) => {
    console.log("Search query:", query);
    // Handle search logic here
  };

  const handleButtonPress = (callback: () => void) => {
    scale.value = withSpring(0.95, { damping: 10 }, () => {
      scale.value = withSpring(1, { damping: 10 });
    });
    callback();
  };

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <>
      <View
        style={[
          styles.container,
          {
            paddingTop: Math.max(insets.top - 10, 0), // Reduced top spacing
          },
        ]}
      >
        {/* Glass background - matching bottom nav style */}
        <BlurView
          intensity={30}
          tint={isDark ? "dark" : "light"}
          style={StyleSheet.absoluteFill}
        />
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: isDark
                ? "rgba(30, 30, 30, 0.6)"
                : "rgba(255, 255, 255, 0.75)",
            },
          ]}
        />
        {/* Border at bottom */}
        <View
          style={[
            {
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 1,
              backgroundColor: isDark
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.05)",
            },
          ]}
        />
        <View style={[styles.content, { minHeight: 44, paddingTop: 4 }]}>
          {/* Left Section: Back + Title */}
          <View style={styles.leftSection}>
            {shouldShowBack && (
              <AnimatedTouchableOpacity
                onPress={() => handleButtonPress(handleBackPress)}
                style={[styles.iconButton, animatedButtonStyle]}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityRole="button"
                accessibilityLabel="Go back"
              >
                <IconSymbol
                  name="chevron.left"
                  size={24}
                  color={colors.foreground}
                />
              </AnimatedTouchableOpacity>
            )}

            {displayTitle && (
              <Text
                style={[styles.title, { color: colors.foreground }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {displayTitle}
              </Text>
            )}
          </View>

          {/* Right Section: Actions */}
          <View style={styles.rightSection}>
            {rightActions}

            {showNotifications && (
              <NotificationIcon size={22} onPress={onNotificationPress} />
            )}

            {showSearch && (
              <AnimatedTouchableOpacity
                onPress={() => handleButtonPress(handleSearchPress)}
                style={[styles.iconButton, animatedButtonStyle]}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityRole="button"
                accessibilityLabel="Open search"
              >
                <IconSymbol
                  name="magnifyingglass"
                  size={22}
                  color={colors.foreground}
                />
              </AnimatedTouchableOpacity>
            )}

            {showThemeToggle && <ThemeToggle size={22} />}

            {showProfile && <ProfileDropdown size={32} />}
          </View>
        </View>
      </View>

      {/* Search Command Bar */}
      {showSearch && (
        <SearchCommandBar
          visible={searchVisible}
          onClose={() => setSearchVisible(false)}
          onSearch={handleSearch}
          placeholder="Search..."
        />
      )}
    </>
  );
}

/**
 * Get title from route pathname
 */
function getTitleFromRoute(pathname: string): string {
  if (!pathname) return "";

  // Remove leading slash and split
  const parts = pathname.replace(/^\//, "").split("/");

  // Get the last part
  const lastPart = parts[parts.length - 1];

  // Handle special cases
  if (lastPart === "index" || lastPart === "(tabs)") {
    return "Home";
  }

  // Capitalize first letter
  return (
    lastPart.charAt(0).toUpperCase() + lastPart.slice(1).replace(/-/g, " ")
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 100,
    overflow: "hidden",
    backgroundColor: "transparent", // Ensure no white background
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 8,
    position: "relative",
    zIndex: 1,
  },
  leftSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minWidth: 0, // Allow flex shrinking
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 0, // Prevent shrinking
    marginLeft: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    flexShrink: 1,
    minWidth: 0,
  },
});
