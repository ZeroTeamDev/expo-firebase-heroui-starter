/**
 * Notification Banner Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Push notification banner for displaying notifications at the top/bottom of screen
 */

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from 'heroui-native';
import type { NotificationVariant } from '@/app/modules/examples/notification-example/types';

export interface NotificationBannerProps {
  id: string;
  title: string;
  message?: string;
  variant?: NotificationVariant;
  icon?: React.ReactNode;
  duration?: number;
  onDismiss?: (id: string) => void;
  actions?: Array<{
    label: string;
    onPress: () => void;
  }>;
  placement?: 'top' | 'bottom';
  style?: ViewStyle;
}

export function NotificationBanner({
  id,
  title,
  message,
  variant = 'default',
  icon,
  duration = 4000,
  onDismiss,
  actions,
  placement = 'top',
  style,
}: NotificationBannerProps) {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';
  const translateY = useRef(new Animated.Value(placement === 'top' ? -100 : 100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Animate in
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Auto dismiss
    if (duration > 0) {
      timeoutRef.current = setTimeout(() => {
        handleDismiss();
      }, duration);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: placement === 'top' ? -100 : 100,
        duration: 250,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss?.(id);
    });
  };

  const palette = getVariantPalette(variant, colors, isDark);

  const webBlurStyle =
    Platform.OS === 'web' ? ({ backdropFilter: 'blur(12px)' } as Record<string, unknown>) : null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.banner,
          {
            backgroundColor: palette.background,
            borderColor: palette.border,
          },
          webBlurStyle,
        ]}
      >
        <View style={styles.content}>
          {icon && <View style={[styles.iconContainer, { backgroundColor: palette.iconBg }]}>{icon}</View>}
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: palette.title }]}>{title}</Text>
            {message && <Text style={[styles.message, { color: palette.message }]}>{message}</Text>}
          </View>
        </View>

        <View style={styles.actions}>
          {actions && actions.length > 0 && (
            <View style={styles.actionButtons}>
              {actions.map((action, index) => (
                <Pressable
                  key={index}
                  onPress={() => {
                    action.onPress();
                    handleDismiss();
                  }}
                  style={[styles.actionButton, { backgroundColor: palette.actionBg }]}
                >
                  <Text style={[styles.actionText, { color: palette.actionText }]}>
                    {action.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
          <Pressable onPress={handleDismiss} style={styles.dismissButton}>
            <Text style={[styles.dismissText, { color: palette.message }]}>✕</Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

function getVariantPalette(
  variant: NotificationVariant,
  colors: any,
  isDark: boolean
): {
  background: string;
  border: string;
  title: string;
  message: string;
  iconBg: string;
  actionBg: string;
  actionText: string;
} {
  const palettes = {
    default: {
      background: isDark ? 'rgba(30,41,59,0.95)' : 'rgba(255,255,255,0.95)',
      border: isDark ? 'rgba(148,163,184,0.32)' : 'rgba(148,163,184,0.36)',
      title: colors.foreground || (isDark ? '#f1f5f9' : '#1e293b'),
      message: isDark ? '#cbd5e1' : '#64748b',
      iconBg: isDark ? 'rgba(99,102,241,0.28)' : 'rgba(79,70,229,0.14)',
      actionBg: colors.accent || '#6366f1',
      actionText: colors.accentForeground || '#ffffff',
    },
    success: {
      background: isDark ? 'rgba(22,163,74,0.2)' : 'rgba(34,197,94,0.12)',
      border: isDark ? 'rgba(34,197,94,0.4)' : 'rgba(34,197,94,0.3)',
      title: '#16a34a',
      message: isDark ? '#dcfce7' : '#14532d',
      iconBg: isDark ? 'rgba(34,197,94,0.28)' : 'rgba(34,197,94,0.16)',
      actionBg: '#16a34a',
      actionText: '#ffffff',
    },
    error: {
      background: isDark ? 'rgba(220,38,38,0.25)' : 'rgba(248,113,113,0.16)',
      border: isDark ? 'rgba(220,38,38,0.45)' : 'rgba(220,38,38,0.36)',
      title: '#dc2626',
      message: isDark ? '#fecaca' : '#7f1d1d',
      iconBg: isDark ? 'rgba(220,38,38,0.28)' : 'rgba(220,38,38,0.18)',
      actionBg: '#dc2626',
      actionText: '#ffffff',
    },
    info: {
      background: isDark ? 'rgba(37,99,235,0.25)' : 'rgba(96,165,250,0.18)',
      border: isDark ? 'rgba(37,99,235,0.4)' : 'rgba(37,99,235,0.32)',
      title: '#2563eb',
      message: isDark ? '#bfdbfe' : '#1e3a8a',
      iconBg: isDark ? 'rgba(37,99,235,0.32)' : 'rgba(37,99,235,0.18)',
      actionBg: '#2563eb',
      actionText: '#ffffff',
    },
    warning: {
      background: isDark ? 'rgba(217,119,6,0.24)' : 'rgba(253,224,71,0.18)',
      border: isDark ? 'rgba(217,119,6,0.4)' : 'rgba(217,119,6,0.34)',
      title: '#d97706',
      message: isDark ? '#fde68a' : '#78350f',
      iconBg: isDark ? 'rgba(217,119,6,0.32)' : 'rgba(217,119,6,0.2)',
      actionBg: '#d97706',
      actionText: '#ffffff',
    },
  };

  return palettes[variant];
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: 16,
  },
  banner: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    minHeight: 64,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  message: {
    fontSize: 13,
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dismissButton: {
    padding: 4,
    borderRadius: 4,
  },
  dismissText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

