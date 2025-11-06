/**
 * AIPrompt Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * AI prompt input component with suggestions.
 * Currently a skeleton - AI suggestions will be implemented later.
 */

import { useTheme } from "heroui-native";
import { View, TextInput, TouchableOpacity, Text, type TextInputProps, type ViewStyle } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";

export interface AIPromptProps extends Omit<TextInputProps, "style"> {
  /**
   * Placeholder text
   * @default "Ask anything..."
   */
  placeholder?: string;
  /**
   * Whether to show AI suggestions
   * @default false
   */
  showSuggestions?: boolean;
  /**
   * Suggested prompts
   */
  suggestions?: string[];
  /**
   * Callback when suggestion is selected
   */
  onSuggestionSelect?: (suggestion: string) => void;
  /**
   * Callback when submit button is pressed
   */
  onSubmit?: (text: string) => void;
}

export function AIPrompt({
  placeholder = "Ask anything...",
  showSuggestions = false,
  suggestions = [],
  onSuggestionSelect,
  onSubmit,
  value,
  onChangeText,
  ...textInputProps
}: AIPromptProps) {
  const { colors } = useTheme();

  const containerStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface2,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
  };

  const handleSubmit = () => {
    if (value && onSubmit) {
      onSubmit(value);
    }
  };

  return (
    <View>
      <View style={containerStyle}>
        <IconSymbol
          name="sparkles"
          size={20}
          color={colors.mutedForeground}
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={{
            flex: 1,
            color: colors.foreground,
            fontSize: 16,
          }}
          placeholder={placeholder}
          placeholderTextColor={colors.mutedForeground}
          value={value}
          onChangeText={onChangeText}
          multiline
          {...textInputProps}
        />
        {value && (
          <TouchableOpacity onPress={handleSubmit}>
            <IconSymbol name="arrow.up.circle.fill" size={24} color={colors.accent} />
          </TouchableOpacity>
        )}
      </View>

      {showSuggestions && suggestions.length > 0 && (
        <View style={{ marginTop: 8, flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {suggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => onSuggestionSelect?.(suggestion)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 16,
                backgroundColor: colors.surface3,
              }}
            >
              <Text style={{ color: colors.foreground, fontSize: 12 }}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

