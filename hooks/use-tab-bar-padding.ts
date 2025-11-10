/**
 * Hook to calculate bottom padding for screens with tab bar
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * This hook calculates the appropriate bottom padding to ensure
 * content is not hidden behind the bottom tab bar when scrolling
 */

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMemo } from "react";

// Tab bar configuration - should match GlassTabBar.tsx
const TAB_BAR_CONFIG = {
  tabBarHeight: 72, // Height of the tab bar (increased to accommodate text below icon)
  bottomMargin: -10, // Negative margin means tab bar is positioned above bottom
  extraSpacing: 20, // Extra spacing between content and tab bar
} as const;

/**
 * Hook to get bottom padding for content that should not be hidden by tab bar
 *
 * @returns Bottom padding value in pixels
 *
 * @example
 * ```tsx
 * const bottomPadding = useTabBarPadding();
 *
 * <ScrollView
 *   contentContainerStyle={{ paddingBottom: bottomPadding }}
 * >
 *   {/* content *\/}
 * </ScrollView>
 * ```
 */
export function useTabBarPadding(): number {
  const insets = useSafeAreaInsets();

  const padding = useMemo(() => {
    // Calculate bottom padding for content to avoid tab bar overlap
    // Tab bar configuration:
    // - Height: 72px (increased to accommodate text below icon)
    // - Bottom margin: -10px (positioned above safe area bottom)
    // - Extra spacing: 20px (visual breathing room)
    //
    // Total padding needed:
    // - Tab bar height: 72px
    // - Space from tab bar to safe area bottom: 10px (absolute value of bottomMargin)
    // - Safe area bottom inset: dynamic based on device
    // - Extra spacing: 20px

    const totalPadding =
      TAB_BAR_CONFIG.tabBarHeight + // Tab bar itself (72px)
      Math.max(0, -TAB_BAR_CONFIG.bottomMargin) + // Space if tab bar is above bottom (10px)
      TAB_BAR_CONFIG.extraSpacing + // Extra spacing (20px)
      insets.bottom; // Safe area bottom (varies by device)

    return totalPadding;
  }, [insets.bottom]);

  return padding;
}

/**
 * Get static bottom padding without using hook
 * Useful for StyleSheet or static calculations
 *
 * @param safeAreaBottom - Safe area bottom inset
 * @returns Bottom padding value in pixels
 */
export function getTabBarPadding(safeAreaBottom: number = 0): number {
  // Calculate static padding without hook
  // Same calculation as useTabBarPadding but for static use cases

  const totalPadding =
    TAB_BAR_CONFIG.tabBarHeight +
    Math.max(0, -TAB_BAR_CONFIG.bottomMargin) +
    TAB_BAR_CONFIG.extraSpacing +
    safeAreaBottom;

  return totalPadding;
}
