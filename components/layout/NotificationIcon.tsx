/**
 * Notification Icon Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Notification icon with badge for header
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from 'heroui-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useNotificationStore } from '@/stores/notificationStore';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface NotificationIconProps {
  size?: number;
  onPress?: () => void;
}

export function NotificationIcon({ size = 22, onPress }: NotificationIconProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const scale = useSharedValue(1);
  const badgeScale = useSharedValue(1);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Animate icon
    scale.value = withSpring(0.9, { damping: 10 }, () => {
      scale.value = withSpring(1, { damping: 10 });
    });

    // Animate badge if unread
    if (unreadCount > 0) {
      badgeScale.value = withSequence(
        withSpring(1.2, { damping: 8 }),
        withSpring(1, { damping: 8 })
      );
    }

    if (onPress) {
      onPress();
    } else {
      router.push('/modules/examples/notification-example');
    }
  };

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  const hasUnread = unreadCount > 0;
  const displayCount = unreadCount > 99 ? '99+' : unreadCount.toString();

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[styles.container, iconStyle]}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      accessibilityRole="button"
      accessibilityLabel={`Notifications${hasUnread ? `, ${unreadCount} unread` : ''}`}
    >
      <IconSymbol name="bell" size={size} color={colors.foreground} />
      {hasUnread && (
        <Animated.View
          style={[
            styles.badge,
            badgeStyle,
            {
              backgroundColor: colors.danger,
              borderColor: colors.background,
            },
          ]}
        >
          <Text style={[styles.badgeText, { color: colors.dangerForeground }]}>
            {displayCount}
          </Text>
        </Animated.View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 12,
  },
});

