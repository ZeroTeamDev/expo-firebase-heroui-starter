/**
 * LiquidTabBar Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Custom tab bar with animated liquid blob under active tab.
 * Implements smooth sliding blob animation using Skia.
 */

import { useTheme } from "heroui-native";
import { View, TouchableOpacity, type ViewStyle, StyleSheet, useWindowDimensions } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Canvas, Path, Skia, useDerivedValue } from "@shopify/react-native-skia";
import { useEffect, useRef } from "react";
import { useSharedValue, withTiming, Easing, type SharedValue } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

export interface TabItem {
  id: string;
  label: string;
  icon: string;
  route: string;
}

export interface LiquidTabBarProps {
  /**
   * Tab items
   */
  items: TabItem[];
  /**
   * Active tab ID
   */
  activeTabId: string;
  /**
   * Callback when tab is pressed
   */
  onTabPress: (tabId: string) => void;
  /**
   * Whether to show liquid blob animation
   * @default true
   */
  showLiquidBlob?: boolean;
}

// Liquid blob indicator component
function LiquidBlobIndicator({
  animatedX,
  width,
  height,
  color,
}: {
  animatedX: SharedValue<number>;
  width: number;
  height: number;
  color: string;
}) {
  // Animated morphing for blob shape
  const morphProgress = useSharedValue(0);

  useEffect(() => {
    morphProgress.value = withTiming(1, {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });
  }, [morphProgress]);

  const path = useDerivedValue(() => {
    const path = Skia.Path.Make();
    const centerX = animatedX.value + width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;
    const points = 10;
    const time = morphProgress.value % 1;

    // Create blob shape with smooth curves
    for (let i = 0; i < points; i++) {
      const angle = (Math.PI * 2 * i) / points;
      const variation = Math.sin(angle * 2.5 + time * Math.PI * 2) * 0.12 + 1;
      const r = radius * variation;
      const px = centerX + Math.cos(angle) * r;
      const py = centerY + Math.sin(angle) * r * 0.4; // Flatten for tab bar

      if (i === 0) {
        path.moveTo(px, py);
      } else {
        path.lineTo(px, py);
      }
    }
    path.close();
    return path;
  }, [animatedX, morphProgress, width, height]);

  return (
    <Path
      path={path}
      color={color}
      style="fill"
      opacity={0.75}
    />
  );
}

export function LiquidTabBar({
  items,
  activeTabId,
  onTabPress,
  showLiquidBlob = true,
}: LiquidTabBarProps) {
  const { colors } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const tabRefs = useRef<{ [key: string]: { x: number; width: number } }>({});
  const tabBarRef = useRef<View>(null);

  const activeIndex = items.findIndex((item) => item.id === activeTabId);
  const tabWidth = screenWidth / items.length;

  // Animated position for blob
  const blobX = useSharedValue(activeIndex >= 0 ? activeIndex * tabWidth : 0);

  useEffect(() => {
    if (activeIndex >= 0) {
      blobX.value = withTiming(activeIndex * tabWidth, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [activeIndex, tabWidth, blobX]);

  const tabBarStyle: ViewStyle = {
    flexDirection: "row",
    backgroundColor: colors.surface1,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: "space-around",
    position: "relative",
    height: 60,
  };

  const handleTabPress = (tabId: string) => {
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onTabPress(tabId);
  };

  return (
    <View style={tabBarStyle} ref={tabBarRef}>
      {/* Liquid blob indicator */}
      {showLiquidBlob && activeIndex >= 0 && (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: "none",
            },
          ]}
        >
          <Canvas style={StyleSheet.absoluteFill}>
            <LiquidBlobIndicator
              animatedX={blobX}
              width={tabWidth}
              height={60}
              color={colors.accent}
            />
          </Canvas>
        </View>
      )}

      {/* Tab items */}
      {items.map((item, index) => {
        const isActive = item.id === activeTabId;
        return (
          <TouchableOpacity
            key={item.id}
            onPress={() => handleTabPress(item.id)}
            onLayout={(event) => {
              const { x, width } = event.nativeEvent.layout;
              tabRefs.current[item.id] = { x, width };
            }}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 8,
              paddingHorizontal: 16,
              position: "relative",
              zIndex: 1,
            }}
          >
            <IconSymbol
              name={item.icon}
              size={24}
              color={isActive ? colors.accent : colors.mutedForeground}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

