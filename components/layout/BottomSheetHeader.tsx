/**
 * Simple Header for BottomSheet Content
 * Created by Kien AI (leejungkiin@gmail.com)
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "heroui-native";
import { X, ChevronLeft } from "lucide-react-native";
import { LiquidGlassButton } from "@/components/glass/LiquidGlassButton";
import type { BottomSheetHeaderProps } from "./BottomSheet.types";

export const BottomSheetHeader = ({
  title,
  onClose,
  onBack,
  showBackButton,
}: BottomSheetHeaderProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <View style={styles.headerContainer}>
      <View style={styles.buttonContainer}>
        {showBackButton && onBack && (
          <LiquidGlassButton
            variant="icon"
            icon={ChevronLeft}
            iconSize={24}
            onPress={onBack}
          />
        )}
      </View>
      <View style={styles.centerSection}>
        <Text style={[styles.title, { color: isDark ? "#FFF" : "#1f2937" }]}>
          {title}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <LiquidGlassButton
          variant="icon"
          icon={X}
          iconSize={20}
          onPress={onClose}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1f2937",
    // Remove flex and margin to let it size naturally
  },
  buttonContainer: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  centerSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
