/**
 * AIStreaming Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Component to display AI streaming responses with typing animation.
 * Currently a skeleton - streaming animation will be implemented later.
 */

import { useTheme } from "heroui-native";
import { View, Text, ScrollView, type ViewStyle } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";

export interface AIStreamingProps {
  /**
   * Streaming text content
   */
  content?: string;
  /**
   * Whether streaming is in progress
   * @default false
   */
  isStreaming?: boolean;
  /**
   * Whether to show typing indicator
   * @default true
   */
  showTypingIndicator?: boolean;
  /**
   * Error message if any
   */
  error?: string | null;
}

export function AIStreaming({
  content = "",
  isStreaming = false,
  showTypingIndicator = true,
  error = null,
}: AIStreamingProps) {
  const { colors } = useTheme();

  const containerStyle: ViewStyle = {
    padding: 16,
    backgroundColor: colors.surface1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 100,
  };

  // TODO: Implement typing animation
  // For now, just display the content

  return (
    <View style={containerStyle}>
      {error ? (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <IconSymbol name="exclamationmark.triangle.fill" size={20} color={colors.danger} />
          <Text style={{ color: colors.danger, flex: 1 }}>{error}</Text>
        </View>
      ) : (
        <ScrollView>
          <Text style={{ color: colors.foreground, fontSize: 16, lineHeight: 24 }}>
            {content}
            {isStreaming && showTypingIndicator && (
              <Text style={{ color: colors.mutedForeground }}>▋</Text>
            )}
          </Text>
        </ScrollView>
      )}
    </View>
  );
}

