/**
 * GlassModal Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Full-screen modal overlay with glass backdrop effect
 */

import React from 'react';
import {
  View,
  ViewProps,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Pressable,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from 'heroui-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface GlassModalProps extends ViewProps {
  children?: React.ReactNode;
  visible: boolean;
  onClose?: () => void;
  blurIntensity?: number;
  backdropOpacity?: number;
  dismissOnBackdropPress?: boolean;
  animationType?: 'none' | 'slide' | 'fade';
}

export function GlassModal({
  children,
  visible,
  onClose,
  blurIntensity = 30,
  backdropOpacity = 0.5,
  dismissOnBackdropPress = true,
  animationType = 'fade',
  style,
  ...rest
}: GlassModalProps) {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';
  const insets = useSafeAreaInsets();

  const handleBackdropPress = () => {
    if (dismissOnBackdropPress && onClose) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType={animationType}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={StyleSheet.absoluteFill}>
          {/* Backdrop with blur */}
          <BlurView
            intensity={blurIntensity}
            tint={isDark ? 'dark' : 'light'}
            style={StyleSheet.absoluteFill}
          />
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: isDark
                  ? `rgba(0, 0, 0, ${backdropOpacity})`
                  : `rgba(255, 255, 255, ${backdropOpacity * 0.3})`,
              },
            ]}
          />

          {/* Content */}
          <Pressable
            style={[
              styles.content,
              {
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
              },
              style,
            ]}
            onPress={(e) => e.stopPropagation()}
            {...rest}
          >
            {children}
          </Pressable>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});
