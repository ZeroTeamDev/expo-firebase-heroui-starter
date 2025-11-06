/**
 * AIChip Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Voice input chip component with waveform animation.
 * Currently a skeleton - waveform animation will be implemented later.
 */

import { useTheme } from "heroui-native";
import { TouchableOpacity, View, Text, type ViewStyle } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";

export interface AIChipProps {
  /**
   * Whether chip is active/recording
   * @default false
   */
  isActive?: boolean;
  /**
   * Callback when chip is pressed
   */
  onPress?: () => void;
  /**
   * Chip label text
   */
  label?: string;
  /**
   * Whether to show waveform animation
   * @default true
   */
  showWaveform?: boolean;
}

export function AIChip({
  isActive = false,
  onPress,
  label = "Voice Input",
  showWaveform = true,
}: AIChipProps) {
  const { colors } = useTheme();

  const chipStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: isActive ? colors.accent : colors.surface2,
    borderWidth: 1,
    borderColor: isActive ? colors.accent : colors.border,
  };

  // TODO: Implement waveform animation
  // For now, just show a pulsing indicator when active

  return (
    <TouchableOpacity onPress={onPress} style={chipStyle}>
      <IconSymbol
        name="mic.fill"
        size={16}
        color={isActive ? colors.accentForeground : colors.foreground}
      />
      {label && (
        <Text
          style={{
            color: isActive ? colors.accentForeground : colors.foreground,
            marginLeft: 8,
            fontSize: 14,
          }}
        >
          {label}
        </Text>
      )}
      {isActive && showWaveform && (
        <View
          style={{
            marginLeft: 8,
            flexDirection: "row",
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* TODO: Add waveform bars animation */}
          <View
            style={{
              width: 2,
              height: 8,
              backgroundColor: colors.accentForeground,
              borderRadius: 1,
            }}
          />
          <View
            style={{
              width: 2,
              height: 12,
              backgroundColor: colors.accentForeground,
              borderRadius: 1,
            }}
          />
          <View
            style={{
              width: 2,
              height: 8,
              backgroundColor: colors.accentForeground,
              borderRadius: 1,
            }}
          />
        </View>
      )}
    </TouchableOpacity>
  );
}

