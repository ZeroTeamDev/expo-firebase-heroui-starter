/**
 * ProfileDropdown Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Profile dropdown menu with user avatar and menu items
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import { useTheme } from 'heroui-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { GlassPanel } from '@/components/glass';
import { useAuthStore } from '@/stores/authStore';
import { logout } from '@/integrations/firebase.client';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface ProfileDropdownProps {
  size?: number;
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  onPress: () => void;
  variant?: 'default' | 'danger';
}

export function ProfileDropdown({ size = 32 }: ProfileDropdownProps) {
  const { colors, theme } = useTheme();
  const { user } = useAuthStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<View>(null);

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);
  const translateY = useSharedValue(-10);

  useEffect(() => {
    if (isOpen) {
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      translateY.value = withSpring(0, { damping: 15, stiffness: 300 });
    } else {
      opacity.value = withTiming(0, { duration: 150 });
      scale.value = withTiming(0.95, { duration: 150 });
      translateY.value = withTiming(-10, { duration: 150 });
    }
  }, [isOpen, opacity, scale, translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { scale: scale.value },
        { translateY: translateY.value },
      ],
    };
  });

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleMenuItemPress = (onPress: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    handleClose();
    onPress();
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems: MenuItem[] = [
    {
      id: 'profile',
      label: 'Profile',
      icon: 'person.circle.fill',
      onPress: () => {
        // Navigate to profile screen when available
        console.log('Navigate to profile');
      },
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'gear',
      onPress: () => {
        // Navigate to settings screen when available
        console.log('Navigate to settings');
      },
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: 'questionmark.circle',
      onPress: () => {
        // Navigate to help screen when available
        console.log('Navigate to help');
      },
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: 'arrow.right.square',
      onPress: handleLogout,
      variant: 'danger',
    },
  ];

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.displayName) {
      return user.displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const avatarColor = colors.accent;

  return (
    <View ref={dropdownRef} style={styles.container}>
      <TouchableOpacity
        onPress={handleToggle}
        style={[
          styles.avatarButton,
          {
            width: size + 8,
            height: size + 8,
            borderRadius: (size + 8) / 2,
            borderColor: isOpen ? colors.accent : 'transparent',
            borderWidth: isOpen ? 2 : 0,
          },
        ]}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Open profile menu"
      >
        {user?.photoURL ? (
          <View
            style={[
              styles.avatarImage,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
              },
            ]}
          >
            {/* In a real app, use Image component here */}
            <Text style={[styles.avatarText, { color: colors.foreground }]}>
              {getUserInitials()}
            </Text>
          </View>
        ) : (
          <View
            style={[
              styles.avatarPlaceholder,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: avatarColor,
              },
            ]}
          >
            <Text style={[styles.avatarText, { color: colors.accentForeground }]}>
              {getUserInitials()}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={handleClose}
          />
          <Animated.View
            style={[
              styles.dropdown,
              {
                top: size + 12 + insets.top,
                right: 16,
                backgroundColor: colors.surface1,
              },
              animatedStyle,
            ]}
          >
            <GlassPanel
              blurIntensity={25}
              opacity={0.95}
              borderRadius={16}
              padding={8}
              style={styles.menuContainer}
            >
              {/* User Info */}
              <View style={styles.userInfo}>
                <View
                  style={[
                    styles.userAvatar,
                    {
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: avatarColor,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.userAvatarText,
                      { color: colors.accentForeground },
                    ]}
                  >
                    {getUserInitials()}
                  </Text>
                </View>
                <View style={styles.userDetails}>
                  <Text
                    style={[styles.userName, { color: colors.foreground }]}
                    numberOfLines={1}
                  >
                    {user?.displayName || 'User'}
                  </Text>
                  <Text
                    style={[styles.userEmail, { color: colors.mutedForeground }]}
                    numberOfLines={1}
                  >
                    {user?.email || ''}
                  </Text>
                </View>
              </View>

              {/* Menu Items */}
              <View style={styles.menuItems}>
                {menuItems.map((item, index) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => handleMenuItemPress(item.onPress)}
                    style={[
                      styles.menuItem,
                      index < menuItems.length - 1 && styles.menuItemBorder,
                      {
                        borderBottomColor: colors.border,
                      },
                    ]}
                    activeOpacity={0.7}
                  >
                    <IconSymbol
                      name={item.icon as any}
                      size={20}
                      color={
                        item.variant === 'danger'
                          ? colors.danger
                          : colors.foreground
                      }
                    />
                    <Text
                      style={[
                        styles.menuItemText,
                        {
                          color:
                            item.variant === 'danger'
                              ? colors.danger
                              : colors.foreground,
                        },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </GlassPanel>
          </Animated.View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  avatarButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  avatarImage: {
    overflow: 'hidden',
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dropdown: {
    position: 'absolute',
    minWidth: 240,
    maxWidth: SCREEN_WIDTH - 32,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  menuContainer: {
    overflow: 'hidden',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  userAvatar: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    fontSize: 16,
    fontWeight: '600',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
  },
  menuItems: {
    paddingTop: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 12,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
});

