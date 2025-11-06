/**
 * LiquidBlob Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Skia-based liquid blob animation component.
 * Implements smooth blob morphing animation using Skia Canvas and Path.
 */

import { useTheme } from "heroui-native";
import { View, type ViewStyle, StyleSheet } from "react-native";
import { Canvas, Path, Skia, useValue, useComputedValue, runOnJS } from "@shopify/react-native-skia";
import { useMemo, memo, useEffect } from "react";
import { useSharedValue, withRepeat, withTiming, Easing, useAnimatedReaction } from "react-native-reanimated";

export interface LiquidBlobProps {
  /**
   * Number of blobs
   * @default 3
   */
  blobCount?: number;
  /**
   * Animation speed (0-1)
   * @default 0.5
   */
  animationSpeed?: number;
  /**
   * Blob colors
   */
  colors?: string[];
  /**
   * Component width
   * @default 200
   */
  width?: number;
  /**
   * Component height
   * @default 200
   */
  height?: number;
}

// Blob component for individual blob
function BlobShape({
  centerX,
  centerY,
  radius,
  points,
  color,
  timeOffset,
  animationSpeed,
}: {
  centerX: number;
  centerY: number;
  radius: number;
  points: number;
  color: string;
  timeOffset: number;
  animationSpeed: number;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {
        duration: 3000 / animationSpeed,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, [progress, animationSpeed]);

  // Create animated path
  const path = useDerivedValue(() => {
    const path = Skia.Path.Make();
    const angleStep = (Math.PI * 2) / points;
    const time = (progress.value + timeOffset) % 1;
    const startAngle = time * Math.PI * 2;

    for (let i = 0; i < points; i++) {
      const angle = startAngle + angleStep * i;
      // Add variation to radius for blob effect
      const variation = Math.sin(angle * 3 + time * Math.PI * 4) * 0.3 + 1;
      const r = radius * variation;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;

      if (i === 0) {
        path.moveTo(x, y);
      } else {
        path.lineTo(x, y);
      }
    }
    path.close();
    return path;
  }, [progress, timeOffset, centerX, centerY, radius, points]);

  return (
    <Path
      path={path}
      color={color}
      style="fill"
      opacity={0.6}
    />
  );
}

function LiquidBlobComponent({
  blobCount = 3,
  animationSpeed = 0.5,
  colors,
  width = 200,
  height = 200,
}: LiquidBlobProps) {
  const { colors: themeColors } = useTheme();

  // Default colors based on theme
  const defaultColors = useMemo(() => {
    if (colors && colors.length > 0) {
      return colors;
    }
    const accentColor = themeColors.accent;
    // Generate variations of accent color
    return Array.from({ length: blobCount }, (_, i) => {
      const opacity = 0.3 + (i * 0.2) / blobCount;
      // Extract hex color and add alpha
      const hex = accentColor.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    });
  }, [colors, blobCount, themeColors.accent]);

  // Create blob configurations
  const blobConfigs = useMemo(() => {
    return Array.from({ length: blobCount }, (_, index) => {
      const centerX = width / 2 + (Math.cos((index * Math.PI * 2) / blobCount) * width * 0.1);
      const centerY = height / 2 + (Math.sin((index * Math.PI * 2) / blobCount) * height * 0.1);
      const radius = Math.min(width, height) * 0.3;
      const points = 8; // Number of points for blob shape

      return {
        centerX,
        centerY,
        radius,
        points,
        color: defaultColors[index] || defaultColors[0],
        timeOffset: (index * 0.2) % 1,
      };
    });
  }, [blobCount, width, height, defaultColors]);

  const containerStyle: ViewStyle = {
    width,
    height,
    overflow: "hidden",
  };

  return (
    <View style={containerStyle}>
      <Canvas style={StyleSheet.absoluteFill}>
        {blobConfigs.map((blob, index) => (
          <BlobShape
            key={index}
            centerX={blob.centerX}
            centerY={blob.centerY}
            radius={blob.radius}
            points={blob.points}
            color={blob.color}
            timeOffset={blob.timeOffset}
            animationSpeed={animationSpeed}
          />
        ))}
      </Canvas>
    </View>
  );
}

export const LiquidBlob = memo(LiquidBlobComponent);

