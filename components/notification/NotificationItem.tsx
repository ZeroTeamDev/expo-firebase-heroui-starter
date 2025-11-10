/**
 * Notification Item Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Individual notification card for the inbox list
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle, Platform } from 'react-native';
import { useTheme } from 'heroui-native';
import type { Notification } from '@/app/modules/examples/notification-example/types';

export interface NotificationItemProps {
  notification: Notification;
  onPress?: (notification: Notification) => void;
  onToggleRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  style?: ViewStyle;
}

// Get icon background color based on category/variant
const getIconBackgroundColor = (category: string, variant: string, isDark: boolean): string => {
  // Variant colors take priority (more specific)
  const variantColors: Record<string, string> = {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    default: '#6b7280',
  };
  
  // Category fallback colors
  const categoryColors: Record<string, string> = {
    system: '#3b82f6',
    messages: '#8b5cf6',
    updates: '#10b981',
    alerts: '#f59e0b',
  };
  
  return variantColors[variant] || categoryColors[category] || '#6b7280';
};

export function NotificationItem({
  notification,
  onPress,
  onToggleRead,
  onDelete,
  style,
}: NotificationItemProps) {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';
  const isUnread = notification.status === 'unread';

  const handlePress = () => {
    if (onPress) {
      onPress(notification);
    } else if (onToggleRead && isUnread) {
      onToggleRead(notification.id);
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const iconBgColor = getIconBackgroundColor(
    notification.category,
    notification.variant,
    isDark
  );

  return (
    <View style={[styles.container, style]}>
      <Pressable onPress={handlePress} style={styles.pressable}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: isDark ? colors.surface1 || '#1a1a1a' : '#FFFFFF',
              shadowColor: '#000',
            },
          ]}
        >
          {/* Unread indicator dot */}
          {isUnread && (
            <View style={[styles.unreadIndicator, { backgroundColor: colors.accent || '#3b82f6' }]} />
          )}

          <View style={styles.content}>
            {/* Large circular icon */}
            {notification.icon && (
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: iconBgColor,
                  },
                ]}
              >
                <Text style={styles.icon}>{notification.icon}</Text>
              </View>
            )}

            {/* Text content */}
            <View style={styles.textContainer}>
              <Text
                style={[
                  styles.title,
                  {
                    color: isDark ? '#ffffff' : '#000000',
                    fontWeight: isUnread ? '600' : '500',
                  },
                ]}
                numberOfLines={2}
              >
                {notification.title}
              </Text>
              <Text
                style={[
                  styles.message,
                  {
                    color: isDark ? '#a1a1aa' : '#6b7280',
                  },
                ]}
                numberOfLines={2}
              >
                {notification.message}
              </Text>
              <Text
                style={[
                  styles.time,
                  {
                    color: isDark ? '#71717a' : '#9ca3af',
                  },
                ]}
              >
                {formatTime(notification.timestamp)}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    marginHorizontal: 16,
    marginTop: 0,
  },
  pressable: {
    borderRadius: 12,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  unreadIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    zIndex: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  icon: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
    gap: 6,
    paddingTop: 2,
  },
  title: {
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2,
  },
  time: {
    fontSize: 13,
    marginTop: 4,
  },
});

