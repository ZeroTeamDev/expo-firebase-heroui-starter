/**
 * LiquidBackground Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Background liquid effect component for screens.
 * Wrapper around LiquidBlob with full-screen background styling.
 */

import { View, type ViewStyle, StyleSheet, useWindowDimensions } from "react-native";
import { LiquidBlob, type LiquidBlobProps } from "./LiquidBlob";
import { memo } from "react";

export interface LiquidBackgroundProps extends Omit<LiquidBlobProps, "width" | "height"> {
  /**
   * Whether to fill entire screen
   * @default true
   */
  fullScreen?: boolean;
  /**
   * Opacity of background
   * @default 0.1
   */
  opacity?: number;
  /**
   * Custom width (if not fullScreen)
   */
  width?: number;
  /**
   * Custom height (if not fullScreen)
   */
  height?: number;
}

function LiquidBackgroundComponent({
  fullScreen = true,
  opacity = 0.1,
  blobCount = 2, // Reduced for background performance
  animationSpeed = 0.3, // Slower for background
  width,
  height,
  ...liquidBlobProps
}: LiquidBackgroundProps) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const containerStyle: ViewStyle = {
    position: fullScreen ? "absolute" : "relative",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity,
    zIndex: -1,
    overflow: "hidden",
    ...(fullScreen && {
      width: "100%",
      height: "100%",
    }),
  };

  const blobWidth = fullScreen ? screenWidth : width || screenWidth;
  const blobHeight = fullScreen ? screenHeight : height || screenHeight;

  return (
    <View style={containerStyle} pointerEvents="none">
      {/* Multiple blobs positioned across screen */}
      {Array.from({ length: blobCount }, (_, index) => {
        const xOffset = (index % 2) * (blobWidth * 0.3);
        const yOffset = Math.floor(index / 2) * (blobHeight * 0.3);
        
        return (
          <View
            key={index}
            style={[
              StyleSheet.absoluteFill,
              {
                left: xOffset,
                top: yOffset,
                width: blobWidth * 0.6,
                height: blobHeight * 0.6,
              },
            ]}
          >
            <LiquidBlob
              width={blobWidth * 0.6}
              height={blobHeight * 0.6}
              blobCount={1}
              animationSpeed={animationSpeed}
              {...liquidBlobProps}
            />
          </View>
        );
      })}
    </View>
  );
}

export const LiquidBackground = memo(LiquidBackgroundComponent);

