/**
 * GlassModal Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Modal overlay component with glass backdrop effect.
 * Implements backdrop blur with glass panel content container.
 */

import { useTheme } from "heroui-native";
import { Modal, Pressable, View, type ModalProps, type ViewStyle, StyleSheet, Animated } from "react-native";
import { BlurView } from "expo-blur";
import { GlassPanel, type GlassPanelProps } from "./GlassPanel";
import { useEffect, useRef, memo } from "react";

export interface GlassModalProps extends ModalProps {
  /**
   * Whether modal is visible
   */
  visible: boolean;
  /**
   * Callback when modal should close
   */
  onClose?: () => void;
  /**
   * Glass panel props for content container
   */
  glassProps?: GlassPanelProps;
  /**
   * Modal content
   */
  children?: React.ReactNode;
  /**
   * Backdrop blur intensity
   * @default 30
   */
  backdropBlurIntensity?: number;
  /**
   * Backdrop opacity (0-1)
   * @default 0.6
   */
  backdropOpacity?: number;
}

function GlassModalComponent({
  visible,
  onClose,
  glassProps,
  backdropBlurIntensity = 30,
  backdropOpacity = 0.6,
  children,
  ...modalProps
}: GlassModalProps) {
  const { colors, theme } = useTheme();
  const isDark = theme === "dark";
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim]);

  const blurTint: "light" | "dark" | "default" = isDark ? "dark" : "light";
  const backdropColor = isDark
    ? `rgba(0, 0, 0, ${backdropOpacity})`
    : `rgba(0, 0, 0, ${backdropOpacity * 0.5})`;

  const backdropStyle: ViewStyle = {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  };

  const contentContainerStyle: ViewStyle = {
    margin: 20,
    maxWidth: "90%",
    maxHeight: "90%",
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
      {...modalProps}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        {/* Backdrop blur */}
        <BlurView
          intensity={backdropBlurIntensity}
          tint={blurTint}
          style={StyleSheet.absoluteFill}
        />
        {/* Backdrop overlay */}
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: backdropColor,
            },
          ]}
        />
      </Animated.View>

      {/* Backdrop pressable */}
      <Pressable
        style={[StyleSheet.absoluteFill, backdropStyle]}
        onPress={onClose}
      >
        {/* Content container - stops propagation */}
        <Pressable
          style={contentContainerStyle}
          onPress={(e) => e.stopPropagation()}
        >
          <GlassPanel
            blurIntensity={glassProps?.blurIntensity || 20}
            borderRadius={glassProps?.borderRadius || 20}
            {...glassProps}
          >
            {children}
          </GlassPanel>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export const GlassModal = memo(GlassModalComponent);

