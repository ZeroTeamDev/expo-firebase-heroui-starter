/**
 * Reusable BottomSheet Component with Liquid Glass Effect
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * This component is a complete rewrite based on the user-provided HTML/CSS example
 * to achieve a precise liquid glass effect and behavior.
 */
import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Dimensions,
  ScrollView,
  Platform,
  Modal,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { BottomSheetProps } from "./BottomSheet.types";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const BottomSheet = ({
  isVisible,
  onClose,
  children,
  containerStyle,
  maxHeight = 0.9,
}: BottomSheetProps) => {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const backdropOpacity = useSharedValue(0);

  const animationConfig = {
    duration: 500,
    easing: Easing.bezier(0.32, 0.72, 0, 1),
  };

  useEffect(() => {
    if (isVisible) {
      translateY.value = withTiming(0, animationConfig);
      backdropOpacity.value = withTiming(1, { duration: 500 });
    } else {
      translateY.value = withTiming(SCREEN_HEIGHT, animationConfig);
      backdropOpacity.value = withTiming(0, { duration: 500 });
    }
  }, [isVisible]);

  const animatedSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const animatedBackdropStyle = useAnimatedStyle(() => {
    return {
      opacity: backdropOpacity.value,
    };
  });

  const calculatedMaxHeight = SCREEN_HEIGHT * maxHeight;
  const contentMaxHeight =
    calculatedMaxHeight - (insets.top + insets.bottom + 40); // 40 for handle area

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.fullScreenContainer}>
        {/* Backdrop */}
        <AnimatedPressable
          style={[styles.backdrop, animatedBackdropStyle]}
          onPress={onClose}
        />

        {/* Sheet */}
        <Animated.View
          style={[
            styles.sheetContainer,
            { maxHeight: calculatedMaxHeight },
            animatedSheetStyle,
            containerStyle,
          ]}
        >
          {/* Liquid Glass Background */}
          <BlurView intensity={10} style={StyleSheet.absoluteFill} />
          <LinearGradient
            colors={["rgba(255, 255, 255, 0.4)", "rgba(255, 255, 255, 0.1)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />

          {/* Handle bar */}
          <View style={styles.handleBarContainer}>
            <View style={styles.handleBar} />
          </View>

          {/* Scrollable Content */}
          <ScrollView
            style={{ maxHeight: contentMaxHeight }}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    // The example uses a backdrop-blur, which we can simulate by adding a BlurView
    // This is optional and can be intensive. Let's keep it simple for now.
  },
  sheetContainer: {
    width: "95%",
    maxWidth: 480, // Corresponds to max-w-md on web
    alignSelf: "center",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: "hidden",
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)", // Simplified border for now
    // Shadow from the example
    shadowColor: "rgba(31, 38, 135, 0.37)",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 24,
  },
  handleBarContainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 8,
  },
  handleBar: {
    width: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  scrollContent: {
    padding: 16,
    paddingTop: 16, // Add padding to the top of the content area
  },
});
