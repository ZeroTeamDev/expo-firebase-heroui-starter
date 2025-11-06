/**
 * AppHeader Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Standard header component for screens.
 * Currently a skeleton - full implementation will be added later.
 */

import { useTheme } from "heroui-native";
import { View, Text, TouchableOpacity, type ViewStyle } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";

export interface AppHeaderProps {
  /**
   * Screen title
   */
  title?: string;
  /**
   * Whether to show search bar
   * @default false
   */
  showSearch?: boolean;
  /**
   * Whether to show profile avatar
   * @default false
   */
  showProfile?: boolean;
  /**
   * Whether to show theme toggle
   * @default false
   */
  showThemeToggle?: boolean;
  /**
   * Callback when search is pressed
   */
  onSearchPress?: () => void;
  /**
   * Callback when profile is pressed
   */
  onProfilePress?: () => void;
  /**
   * Callback when theme toggle is pressed
   */
  onThemeToggle?: () => void;
  /**
   * Custom header content
   */
  children?: React.ReactNode;
}

export function AppHeader({
  title,
  showSearch = false,
  showProfile = false,
  showThemeToggle = false,
  onSearchPress,
  onProfilePress,
  onThemeToggle,
  children,
}: AppHeaderProps) {
  const { colors, toggleTheme } = useTheme();

  const headerStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface1,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  };

  const handleThemeToggle = () => {
    toggleTheme();
    onThemeToggle?.();
  };

  return (
    <View style={headerStyle}>
      {title && (
        <Text style={{ color: colors.foreground, fontSize: 20, fontWeight: "bold" }}>
          {title}
        </Text>
      )}

      {children}

      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        {showSearch && (
          <TouchableOpacity onPress={onSearchPress}>
            <IconSymbol name="magnifyingglass" size={24} color={colors.foreground} />
          </TouchableOpacity>
        )}

        {showThemeToggle && (
          <TouchableOpacity onPress={handleThemeToggle}>
            <IconSymbol name="sun.max" size={24} color={colors.foreground} />
          </TouchableOpacity>
        )}

        {showProfile && (
          <TouchableOpacity onPress={onProfilePress}>
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: colors.accent,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconSymbol name="person.fill" size={20} color={colors.accentForeground} />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

