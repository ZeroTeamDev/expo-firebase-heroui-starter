/**
 * GlassCard Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Card component with glass effect.
 * Wrapper around GlassPanel with card-specific styling, shadows, and elevation.
 */

import { View, type ViewProps, StyleSheet } from "react-native";
import { GlassPanel, type GlassPanelProps } from "./GlassPanel";
import { useTheme } from "heroui-native";
import { memo } from "react";

export interface GlassCardProps extends Omit<GlassPanelProps, "children"> {
  /**
   * Card padding
   * @default 16
   */
  padding?: number;
  /**
   * Card content
   */
  children?: React.ReactNode;
  /**
   * Card elevation level (0-5)
   * @default 2
   */
  elevation?: number;
}

function GlassCardComponent({
  padding = 16,
  style,
  children,
  elevation = 2,
  ...glassPanelProps
}: GlassCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Enhanced shadow based on elevation
  const shadowStyles = {
    0: {
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    1: {
      shadowOpacity: isDark ? 0.2 : 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    2: {
      shadowOpacity: isDark ? 0.25 : 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    3: {
      shadowOpacity: isDark ? 0.3 : 0.12,
      shadowRadius: 12,
      elevation: 6,
    },
    4: {
      shadowOpacity: isDark ? 0.35 : 0.15,
      shadowRadius: 16,
      elevation: 8,
    },
    5: {
      shadowOpacity: isDark ? 0.4 : 0.18,
      shadowRadius: 20,
      elevation: 10,
    },
  };

  const currentShadow = shadowStyles[elevation as keyof typeof shadowStyles] || shadowStyles[2];

  return (
    <GlassPanel
      style={[
        {
          padding,
          shadowOffset: { width: 0, height: elevation * 2 },
          ...currentShadow,
        },
        style,
      ]}
      {...glassPanelProps}
    >
      {children}
    </GlassPanel>
  );
}

export const GlassCard = memo(GlassCardComponent);

