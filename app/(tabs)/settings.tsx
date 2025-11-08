/**
 * Settings Screen
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * App settings and preferences
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from 'heroui-native';
import { AppHeader } from '@/components/layout/AppHeader';
import { Card } from 'heroui-native';
import { FormSwitch } from '@/components/forms/FormSwitch';
import { FormButton } from '@/components/forms/FormButton';
import { useAuthStore } from '@/stores/authStore';
import { useTabBarPadding } from '@/hooks/use-tab-bar-padding';
import { logout } from '@/integrations/firebase.client';
import { useRouter } from 'expo-router';
import { useToast } from '@/components/feedback/Toast';
import { IconSymbol } from '@/components/ui/icon-symbol';
import Constants from 'expo-constants';

export default function SettingsScreen() {
  const { colors, theme } = useTheme();
  const { user } = useAuthStore();
  const router = useRouter();
  const bottomPadding = useTabBarPadding();
  const { showToast } = useToast();
  const isDark = theme === 'dark';

  // General Settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  // Privacy Settings
  const [profileVisible, setProfileVisible] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);

  // App Info
  const appVersion = Constants.expoConfig?.version || '1.0.0';

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/auth');
              showToast({
                title: 'Logged Out',
                message: 'You have been successfully logged out',
                variant: 'success',
              });
            } catch (error) {
              console.error('Logout error:', error);
              showToast({
                title: 'Error',
                message: 'Failed to logout',
                variant: 'error',
              });
            }
          },
        },
      ]
    );
  };

  const handleChangePassword = () => {
    showToast({
      title: 'Coming Soon',
      message: 'Change password functionality will be available soon',
      variant: 'info',
    });
  };

  const handleEmailManagement = () => {
    showToast({
      title: 'Coming Soon',
      message: 'Email management will be available soon',
      variant: 'info',
    });
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            showToast({
              title: 'Coming Soon',
              message: 'Account deletion will be available soon',
              variant: 'info',
            });
          },
        },
      ]
    );
  };

  const handleOpenTerms = () => {
    // In a real app, this would open your Terms of Service URL
    showToast({
      title: 'Terms of Service',
      message: 'Terms of Service URL would open here',
      variant: 'info',
    });
  };

  const handleOpenPrivacy = () => {
    // In a real app, this would open your Privacy Policy URL
    showToast({
      title: 'Privacy Policy',
      message: 'Privacy Policy URL would open here',
      variant: 'info',
    });
  };

  const handleNotificationSettings = () => {
    // Navigate to notification settings if available
    showToast({
      title: 'Coming Soon',
      message: 'Notification settings will be available soon',
      variant: 'info',
    });
  };

  const renderSettingItem = (
    icon: string,
    label: string,
    description: string,
    onPress?: () => void,
    rightComponent?: React.ReactNode
  ) => {
    const content = (
      <View style={styles.settingItem}>
        <IconSymbol 
          name={icon as any} 
          size={22} 
          color={colors.foreground} 
          style={styles.settingIcon}
        />
        <View style={styles.settingContent}>
          <Text style={[styles.settingLabel, { color: colors.foreground }]}>{label}</Text>
          {description && (
            <Text style={[styles.settingDescription, { color: colors.mutedForeground }]}>
              {description}
            </Text>
          )}
        </View>
        {rightComponent && <View style={styles.settingRight}>{rightComponent}</View>}
        {onPress && (
          <IconSymbol
            name="chevron.right"
            size={16}
            color={colors.mutedForeground}
            style={styles.chevron}
          />
        )}
      </View>
    );

    if (onPress) {
      return (
        <TouchableOpacity
          key={label}
          onPress={onPress}
          activeOpacity={0.7}
          style={styles.settingItemContainer}
        >
          {content}
        </TouchableOpacity>
      );
    }

    return <View key={label} style={styles.settingItemContainer}>{content}</View>;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="Settings" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: bottomPadding }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Settings */}
        <Card className="mb-4 rounded-xl overflow-hidden">
          <Card.Body style={{ padding: 16, gap: 8 }}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Account Settings
            </Text>

            {/* Theme */}
            <View style={styles.settingItemContainer}>
              <View style={styles.settingItem}>
                <View style={styles.settingContent}>
                  <Text style={[styles.settingLabel, { color: colors.foreground }]}>Theme</Text>
                  <Text style={[styles.settingDescription, { color: colors.mutedForeground }]}>
                    Current theme: {isDark ? 'Dark' : 'Light'}
                  </Text>
                </View>
                <Text style={[styles.themeBadge, { color: colors.accent }]}>
                  {isDark ? '🌙 Dark' : '☀️ Light'}
                </Text>
              </View>
            </View>

            {/* Notifications */}
            <FormSwitch
              label="Notifications"
              description="Enable push notifications"
              value={notificationsEnabled}
              onChange={setNotificationsEnabled}
            />

            <FormSwitch
              label="Sound"
              description="Play sounds for notifications"
              value={soundEnabled}
              onChange={setSoundEnabled}
              disabled={!notificationsEnabled}
            />

            <FormSwitch
              label="Vibration"
              description="Vibrate for notifications"
              value={vibrationEnabled}
              onChange={setVibrationEnabled}
              disabled={!notificationsEnabled}
            />

            {/* Account Management */}
            {renderSettingItem(
              'lock.fill',
              'Change Password',
              'Update your account password',
              handleChangePassword
            )}

            {renderSettingItem(
              'envelope.fill',
              'Email Management',
              'Manage your email address',
              handleEmailManagement
            )}

            {renderSettingItem(
              'trash.fill',
              'Delete Account',
              'Permanently delete your account',
              handleDeleteAccount
            )}

            {/* Privacy Settings */}
            <FormSwitch
              label="Profile Visibility"
              description="Make your profile visible to others"
              value={profileVisible}
              onChange={setProfileVisible}
            />

            <FormSwitch
              label="Data Sharing"
              description="Allow data sharing for analytics"
              value={dataSharing}
              onChange={setDataSharing}
            />

            {renderSettingItem(
              'bell.fill',
              'Notification Settings',
              'Configure notification preferences',
              handleNotificationSettings
            )}

            {/* App Info */}
            <View style={styles.settingItemContainer}>
              <View style={styles.settingItem}>
                <View style={styles.settingContent}>
                  <Text style={[styles.settingLabel, { color: colors.foreground }]}>App Version</Text>
                  <Text style={[styles.settingDescription, { color: colors.mutedForeground }]}>
                    Version {appVersion}
                  </Text>
                </View>
              </View>
            </View>

            {renderSettingItem(
              'doc.text.fill',
              'Terms of Service',
              'Read our terms of service',
              handleOpenTerms
            )}

            {renderSettingItem(
              'shield.fill',
              'Privacy Policy',
              'Read our privacy policy',
              handleOpenPrivacy
            )}
          </Card.Body>
        </Card>

        {/* Logout Button */}
        <Card className="mb-4 rounded-xl overflow-hidden">
          <Card.Body style={{ padding: 16 }}>
            <FormButton
              title="Logout"
              onPress={handleLogout}
              variant="danger"
              fullWidth
            />
          </Card.Body>
        </Card>

        {/* User Info Footer */}
        {user && (
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
              Signed in as {user.email}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  settingItemContainer: {
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  settingIcon: {
    marginRight: 12,
    opacity: 0.8,
  },
  settingContent: {
    flex: 1,
    minWidth: 0,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    marginTop: 2,
  },
  settingRight: {
    marginLeft: 12,
  },
  chevron: {
    marginLeft: 8,
  },
  themeBadge: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 12,
  },
});

