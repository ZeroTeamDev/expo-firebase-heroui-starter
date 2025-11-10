/**
 * SearchCommandBar Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Full-screen search modal with command bar style interface
 */

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Keyboard,
} from "react-native";
import { useTheme } from "heroui-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GlassModal } from "@/components/glass";
import { IconSymbol } from "@/components/ui/icon-symbol";
import * as Haptics from "expo-haptics";

export interface SearchCommandBarProps {
  visible: boolean;
  onClose: () => void;
  onSearch?: (query: string) => void;
  recentSearches?: string[];
  placeholder?: string;
}

export function SearchCommandBar({
  visible,
  onClose,
  onSearch,
  recentSearches = [],
  placeholder = "Search...",
}: SearchCommandBarProps) {
  const { colors, theme } = useTheme();
  const isDark = theme === "dark";
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecent, setFilteredRecent] =
    useState<string[]>(recentSearches);
  const inputRef = useRef<TextInput>(null);

  const translateY = useSharedValue(-50);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 20, stiffness: 300 });
      opacity.value = withTiming(1, { duration: 200 });
      // Focus input after animation
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    } else {
      translateY.value = withTiming(-50, { duration: 200 });
      opacity.value = withTiming(0, { duration: 200 });
      setSearchQuery("");
      Keyboard.dismiss();
    }
  }, [visible, translateY, opacity]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = recentSearches.filter((item) =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRecent(filtered);
    } else {
      setFilteredRecent(recentSearches);
    }
  }, [searchQuery, recentSearches]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  const handleSearch = (query: string) => {
    if (query.trim()) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onSearch?.(query.trim());
      onClose();
    }
  };

  const handleSubmit = () => {
    handleSearch(searchQuery);
  };

  const handleRecentPress = (item: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSearchQuery(item);
    handleSearch(item);
  };

  const handleClear = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSearchQuery("");
    inputRef.current?.focus();
  };

  const quickActions = [
    { id: "1", label: "Recent", icon: "clock" },
    { id: "2", label: "Trending", icon: "trending-up" },
    { id: "3", label: "Popular", icon: "star" },
  ];

  return (
    <GlassModal
      visible={visible}
      onClose={onClose}
      blurIntensity={30}
      backdropOpacity={0.6}
      animationType="fade"
    >
      <Animated.View style={[styles.container, animatedStyle]}>
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              paddingTop: Math.max(insets.top - 25, 0), // Reduce top spacing to match AppHeader
              paddingBottom: 0,
              marginLeft: 16,
              marginRight: 16,
            },
          ]}
        >
          <View
            style={[
              styles.searchContainer,
              {
                backgroundColor: isDark
                  ? "rgba(50, 50, 50, 0.8)"
                  : "rgba(255, 255, 255, 0.95)",
                borderWidth: 2,
                borderColor: isDark
                  ? "rgba(255, 255, 255, 0.2)"
                  : "rgba(0, 0, 0, 0.1)",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              },
            ]}
          >
            <View style={styles.searchInputContainer}>
              <IconSymbol
                name="magnifyingglass"
                size={22}
                color={colors.accent}
              />
              <TextInput
                ref={inputRef}
                style={[
                  styles.searchInput,
                  {
                    color: colors.foreground,
                    fontSize: 17,
                    fontWeight: "500",
                  },
                ]}
                placeholder={placeholder}
                placeholderTextColor={colors.mutedForeground}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSubmit}
                returnKeyType="search"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={handleClear}
                  style={styles.clearButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text
                    style={[
                      styles.clearText,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    ✕
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <TouchableOpacity
            onPress={onClose}
            style={[styles.closeButton, { marginLeft: 12 }]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.closeText, { color: colors.foreground }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {searchQuery.trim() === "" && recentSearches.length > 0 && (
            <View style={styles.section}>
              <Text
                style={[styles.sectionTitle, { color: colors.mutedForeground }]}
              >
                Recent Searches
              </Text>
              <FlatList
                data={recentSearches}
                keyExtractor={(item, index) => `recent-${index}`}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleRecentPress(item)}
                    style={[
                      styles.recentItem,
                      {
                        borderBottomColor: colors.border,
                      },
                    ]}
                  >
                    <IconSymbol
                      name="clock"
                      size={18}
                      color={colors.mutedForeground}
                    />
                    <Text
                      style={[styles.recentText, { color: colors.foreground }]}
                    >
                      {item}
                    </Text>
                    <IconSymbol
                      name="chevron.right"
                      size={18}
                      color={colors.mutedForeground}
                    />
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => (
                  <View style={{ height: 1, backgroundColor: "transparent" }} />
                )}
              />
            </View>
          )}

          {searchQuery.trim() === "" && (
            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color: colors.mutedForeground,
                    marginLeft: 16,
                    marginRight: 16,
                  },
                ]}
              >
                Quick Actions
              </Text>
              <View style={[styles.quickActions, { paddingHorizontal: 16 }]}>
                {quickActions.map((action) => (
                  <TouchableOpacity
                    key={action.id}
                    style={[
                      styles.quickActionButton,
                      {
                        backgroundColor: colors.surface2,
                        borderColor: colors.border,
                      },
                    ]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      // Handle quick action
                      console.log("Quick action:", action.label);
                    }}
                  >
                    <Text
                      style={[
                        styles.quickActionText,
                        { color: colors.foreground },
                      ]}
                    >
                      {action.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {searchQuery.trim() !== "" && filteredRecent.length === 0 && (
            <View style={styles.emptyState}>
              <Text
                style={[styles.emptyText, { color: colors.mutedForeground }]}
              >
                No results found
              </Text>
            </View>
          )}

          {searchQuery.trim() !== "" && filteredRecent.length > 0 && (
            <View style={styles.section}>
              <Text
                style={[styles.sectionTitle, { color: colors.mutedForeground }]}
              >
                Suggestions
              </Text>
              <FlatList
                data={filteredRecent}
                keyExtractor={(item, index) => `suggestion-${index}`}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleRecentPress(item)}
                    style={[
                      styles.recentItem,
                      {
                        borderBottomColor: colors.border,
                      },
                    ]}
                  >
                    <IconSymbol
                      name="magnifyingglass"
                      size={18}
                      color={colors.mutedForeground}
                    />
                    <Text
                      style={[styles.recentText, { color: colors.foreground }]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>
      </Animated.View>
    </GlassModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  searchContainer: {
    flex: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 56,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchInput: {
    flex: 1,
    padding: 0,
    minHeight: 24,
  },
  clearButton: {
    padding: 4,
  },
  clearText: {
    fontSize: 18,
    fontWeight: "600",
  },
  closeButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  closeText: {
    fontSize: 16,
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
    gap: 12,
    borderBottomWidth: 1,
  },
  recentText: {
    flex: 1,
    fontSize: 16,
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8, // Reduced from 12 to bring buttons closer together
  },
  quickActionButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: "500",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
  },
});
