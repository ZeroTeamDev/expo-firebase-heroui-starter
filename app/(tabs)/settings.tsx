/**
 * Settings Screen
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * App settings and preferences
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { useTheme } from 'heroui-native';
import { AppHeader } from '@/components/layout/AppHeader';
import { FormSwitch } from '@/components/forms/FormSwitch';
import { FormButton } from '@/components/forms/FormButton';
import { useAuthStore } from '@/stores/authStore';
import { useSettingsStore, type ThemeMode } from '@/stores/settingsStore';
import { useTabBarPadding } from '@/hooks/use-tab-bar-padding';
import { logout } from '@/integrations/firebase.client';
import { useRouter } from 'expo-router';
import { useToast } from '@/components/feedback/Toast';
import { IconSymbol } from '@/components/ui/icon-symbol';
import Constants from 'expo-constants';
import { useColorScheme } from 'react-native';

export default function SettingsScreen() {
  const { colors, theme } = useTheme();
  const { user } = useAuthStore();
  const router = useRouter();
  const bottomPadding = useTabBarPadding();
  const { showToast } = useToast();
  const systemColorScheme = useColorScheme();
  const isDark = theme === 'dark';

  // Settings from store
  const settingsTheme = useSettingsStore((state) => state.theme);
  const setTheme = useSettingsStore((state) => state.setTheme);
  const notificationsEnabled = useSettingsStore((state) => state.notificationsEnabled);
  const setNotificationsEnabled = useSettingsStore((state) => state.setNotificationsEnabled);
  const soundEnabled = useSettingsStore((state) => state.soundEnabled);
  const setSoundEnabled = useSettingsStore((state) => state.setSoundEnabled);
  const vibrationEnabled = useSettingsStore((state) => state.vibrationEnabled);
  const setVibrationEnabled = useSettingsStore((state) => state.setVibrationEnabled);
  const profileVisible = useSettingsStore((state) => state.profileVisible);
  const setProfileVisible = useSettingsStore((state) => state.setProfileVisible);
  const dataSharing = useSettingsStore((state) => state.dataSharing);
  const setDataSharing = useSettingsStore((state) => state.setDataSharing);

  // Theme selector state
  const [showThemeSelector, setShowThemeSelector] = useState(false);

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

  const handleThemeSelect = (selectedTheme: ThemeMode) => {
    setTheme(selectedTheme);
    setShowThemeSelector(false);
    showToast({
      title: 'Theme Updated',
      message: `Theme changed to ${selectedTheme === 'system' ? 'System' : selectedTheme === 'light' ? 'Light' : 'Dark'}`,
      variant: 'success',
    });
  };

  const getThemeDisplayName = (themeMode: ThemeMode): string => {
    if (themeMode === 'system') {
      return `System (${systemColorScheme === 'dark' ? 'Dark' : 'Light'})`;
    }
    return themeMode === 'light' ? 'Light' : 'Dark';
  };

  const getThemeIcon = (themeMode: ThemeMode): string => {
    if (themeMode === 'system') return 'gearshape.fill';
    return themeMode === 'light' ? 'sun.max.fill' : 'moon.fill';
  };

  const renderSettingItem = (
    icon: string,
    label: string,
    description: string,
    onPress?: () => void,
    rightComponent?: React.ReactNode,
    showDivider: boolean = true
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
        <View key={label}>
          <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.6}
            style={styles.settingItemContainer}
          >
            {content}
          </TouchableOpacity>
          {showDivider && (
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
          )}
        </View>
      );
    }

    return (
      <View key={label}>
        <View style={styles.settingItemContainer}>{content}</View>
        {showDivider && (
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
        )}
      </View>
    );
  };

  const surfaceColor = colors.surface1 || (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)');
  const dividerColor = colors.border || (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)');

  const renderSection = (title: string, children: React.ReactNode) => {
    return (
      <View style={styles.sectionContainer}>
        <View style={[styles.section, { backgroundColor: surfaceColor }]}>
          {title && (
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                {title}
              </Text>
            </View>
          )}
          <View style={styles.sectionContent}>
            {children}
          </View>
        </View>
      </View>
    );
  };

  const renderSwitchItem = (
    label: string,
    description: string,
    value: boolean,
    onChange: (value: boolean) => void,
    disabled?: boolean,
    showDivider: boolean = true
  ) => {
    return (
      <>
        <View style={styles.switchContainer}>
          <View style={styles.switchWrapper}>
            <FormSwitch
              label={label}
              description={description}
              value={value}
              onChange={onChange}
              disabled={disabled}
            />
          </View>
        </View>
        {showDivider && (
          <View style={[styles.divider, { backgroundColor: dividerColor }]} />
        )}
      </>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="Settings" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: bottomPadding }]}
        showsVerticalScrollIndicator={false}
      >
        {/* General Settings */}
        {renderSection('General', (
          <>
            {/* Theme Selector */}
            <TouchableOpacity
              onPress={() => setShowThemeSelector(!showThemeSelector)}
              activeOpacity={0.6}
              style={styles.settingItemContainer}
            >
              <View style={styles.settingItem}>
                <IconSymbol 
                  name="paintbrush.fill" as any
                  size={22} 
                  color={colors.foreground} 
                  style={styles.settingIcon}
                />
                <View style={styles.settingContent}>
                  <Text style={[styles.settingLabel, { color: colors.foreground }]}>Theme</Text>
                  <Text style={[styles.settingDescription, { color: colors.mutedForeground }]}>
                    {getThemeDisplayName(settingsTheme)}
                  </Text>
                </View>
                <IconSymbol
                  name={getThemeIcon(settingsTheme) as any}
                  size={20}
                  color={colors.accent}
                  style={styles.themeIcon}
                />
                <IconSymbol
                  name={showThemeSelector ? "chevron.up" : "chevron.down"}
                  size={16}
                  color={colors.mutedForeground}
                  style={styles.chevron}
                />
              </View>
            </TouchableOpacity>
            
            {showThemeSelector && (
              <View style={[styles.themeSelector, { backgroundColor: colors.surface2 }]}>
                {(['light', 'dark', 'system'] as ThemeMode[]).map((themeOption) => {
                  const isSelected = settingsTheme === themeOption;
                  return (
                    <TouchableOpacity
                      key={themeOption}
                      onPress={() => handleThemeSelect(themeOption)}
                      style={[
                        styles.themeOption,
                        isSelected && { backgroundColor: colors.accent + '20' },
                      ]}
                      activeOpacity={0.7}
                    >
                      <IconSymbol
                        name={getThemeIcon(themeOption) as any}
                        size={20}
                        color={isSelected ? colors.accent : colors.foreground}
                        style={styles.themeOptionIcon}
                      />
                      <Text
                        style={[
                          styles.themeOptionText,
                          { color: isSelected ? colors.accent : colors.foreground },
                        ]}
                      >
                        {getThemeDisplayName(themeOption)}
                      </Text>
                      {isSelected && (
                        <IconSymbol
                          name="checkmark.circle.fill"
                          size={20}
                          color={colors.accent}
                          style={styles.checkIcon}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
            <View style={[styles.divider, { backgroundColor: dividerColor }]} />

            {/* Notifications */}
            {renderSwitchItem(
              "Notifications",
              "Enable push notifications",
              notificationsEnabled,
              setNotificationsEnabled,
              false,
              true
            )}

            {renderSwitchItem(
              "Sound",
              "Play sounds for notifications",
              soundEnabled,
              setSoundEnabled,
              !notificationsEnabled,
              true
            )}

            {renderSwitchItem(
              "Vibration",
              "Vibrate for notifications",
              vibrationEnabled,
              setVibrationEnabled,
              !notificationsEnabled,
              false
            )}
          </>
        ))}

        {/* Privacy Settings */}
        {renderSection('Privacy', (
          <>
            {renderSwitchItem(
              "Profile Visibility",
              "Make your profile visible to others",
              profileVisible,
              setProfileVisible,
              false,
              true
            )}

            {renderSwitchItem(
              "Data Sharing",
              "Allow data sharing for analytics",
              dataSharing,
              setDataSharing,
              false,
              true
            )}

            {renderSettingItem(
              'bell.fill',
              'Notification Settings',
              'Configure notification preferences',
              handleNotificationSettings,
              undefined,
              false
            )}
          </>
        ))}

        {/* About */}
        {renderSection('About', (
          <>
            <View style={styles.settingItemContainer}>
              <View style={styles.settingItem}>
                <IconSymbol 
                  name="info.circle.fill" as any
                  size={22} 
                  color={colors.foreground} 
                  style={styles.settingIcon}
                />
                <View style={styles.settingContent}>
                  <Text style={[styles.settingLabel, { color: colors.foreground }]}>App Version</Text>
                  <Text style={[styles.settingDescription, { color: colors.mutedForeground }]}>
                    Version {appVersion}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.divider, { backgroundColor: dividerColor }]} />

            {renderSettingItem(
              'doc.text.fill',
              'Terms of Service',
              'Read our terms of service',
              handleOpenTerms,
              undefined,
              true
            )}

            {renderSettingItem(
              'shield.fill',
              'Privacy Policy',
              'Read our privacy policy',
              handleOpenPrivacy,
              undefined,
              false
            )}
          </>
        ))}

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <View style={[styles.logoutSection, { backgroundColor: surfaceColor }]}>
            <FormButton
              title="Logout"
              onPress={handleLogout}
              variant="danger"
              fullWidth
            />
          </View>
        </View>

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
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  section: {
    borderRadius: 14,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.6,
  },
  sectionContent: {
    paddingVertical: 4,
  },
  settingItemContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
    justifyContent: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: '400',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
  },
  settingRight: {
    marginLeft: 12,
  },
  chevron: {
    marginLeft: 8,
    opacity: 0.4,
  },
  themeBadge: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  themeIcon: {
    marginRight: 8,
  },
  themeSelector: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 12,
    padding: 8,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 2,
  },
  themeOptionIcon: {
    marginRight: 12,
  },
  themeOptionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
  },
  checkIcon: {
    marginLeft: 8,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 16,
    marginRight: 16,
  },
  switchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  switchWrapper: {
    marginBottom: -16, // Compensate for FormSwitch's internal marginBottom
  },
  logoutContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  logoutSection: {
    borderRadius: 14,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  footerText: {
    fontSize: 12,
    opacity: 0.6,
  },
});

