/**
 * AppDrawer Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Side drawer navigation component.
 * Currently a skeleton - full drawer implementation will be added later.
 */

import { useTheme } from "heroui-native";
import { View, Text, TouchableOpacity, ScrollView, type ViewStyle } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";

export interface DrawerItem {
  id: string;
  title: string;
  icon?: string;
  onPress?: () => void;
  badge?: string | number;
}

export interface AppDrawerProps {
  /**
   * Whether drawer is visible
   */
  visible: boolean;
  /**
   * Callback when drawer should close
   */
  onClose?: () => void;
  /**
   * Drawer items
   */
  items?: DrawerItem[];
  /**
   * Whether to show settings section
   * @default true
   */
  showSettings?: boolean;
  /**
   * Whether to show labs/experiments section
   * @default false
   */
  showLabs?: boolean;
}

export function AppDrawer({
  visible,
  onClose,
  items = [],
  showSettings = true,
  showLabs = false,
}: AppDrawerProps) {
  const { colors } = useTheme();

  if (!visible) return null;

  const drawerStyle: ViewStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  };

  const contentStyle: ViewStyle = {
    width: "80%",
    maxWidth: 320,
    height: "100%",
    backgroundColor: colors.surface1,
    paddingTop: 60,
    paddingHorizontal: 16,
  };

  return (
    <TouchableOpacity style={drawerStyle} activeOpacity={1} onPress={onClose}>
      <TouchableOpacity
        style={contentStyle}
        activeOpacity={1}
        onPress={(e) => e.stopPropagation()}
      >
        <ScrollView>
          <View style={{ gap: 8 }}>
            {items.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  item.onPress?.();
                  onClose?.();
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  backgroundColor: colors.surface2,
                }}
              >
                {item.icon && (
                  <IconSymbol
                    name={item.icon}
                    size={24}
                    color={colors.foreground}
                    style={{ marginRight: 12 }}
                  />
                )}
                <Text style={{ color: colors.foreground, fontSize: 16, flex: 1 }}>
                  {item.title}
                </Text>
                {item.badge && (
                  <View
                    style={{
                      backgroundColor: colors.accent,
                      borderRadius: 12,
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                    }}
                  >
                    <Text style={{ color: colors.accentForeground, fontSize: 12 }}>
                      {item.badge}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

