/**
 * Notification Settings Screen
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Notification settings and preferences
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from 'heroui-native';
import { AppHeader } from '@/components/layout/AppHeader';
import { Card } from 'heroui-native';
import { FormSwitch } from '@/components/forms/FormSwitch';
import { FormButton } from '@/components/forms/FormButton';
import { useToast } from '@/components/feedback/Toast';
import type { NotificationCategory } from './types';

export default function NotificationSettingsScreen() {
  const { colors } = useTheme();
  const { showToast } = useToast();

  // Global settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);
  const [previewStyle, setPreviewStyle] = useState<'always' | 'whenUnlocked' | 'never'>('always');
  const [showOnLockScreen, setShowOnLockScreen] = useState(true);
  const [groupNotifications, setGroupNotifications] = useState(true);

  // Category settings
  const [categorySettings, setCategorySettings] = useState<Record<NotificationCategory, boolean>>({
    system: true,
    messages: true,
    updates: true,
    alerts: true,
  });

  const [categorySounds, setCategorySounds] = useState<Record<NotificationCategory, boolean>>({
    system: true,
    messages: true,
    updates: false,
    alerts: true,
  });

  const handleSave = () => {
    showToast({
      title: 'Settings Saved',
      message: 'Your notification settings have been saved',
      variant: 'success',
    });
  };

  const handleReset = () => {
    setNotificationsEnabled(true);
    setSoundEnabled(true);
    setVibrationEnabled(true);
    setQuietHoursEnabled(false);
    setPreviewStyle('always');
    setShowOnLockScreen(true);
    setGroupNotifications(true);
    setCategorySettings({
      system: true,
      messages: true,
      updates: true,
      alerts: true,
    });
    setCategorySounds({
      system: true,
      messages: true,
      updates: false,
      alerts: true,
    });
    showToast({
      title: 'Settings Reset',
      message: 'All settings have been reset to defaults',
      variant: 'info',
    });
  };

  const getCategoryLabel = (category: NotificationCategory) => {
    const labels: Record<NotificationCategory, string> = {
      system: 'System',
      messages: 'Messages',
      updates: 'Updates',
      alerts: 'Alerts',
    };
    return labels[category];
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="Notification Settings" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Global Settings */}
        <Card className="mb-4 rounded-xl">
          <Card.Body style={{ padding: 16, gap: 16 }}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Global Settings</Text>

            <FormSwitch
              label="Enable Notifications"
              description="Receive push notifications"
              value={notificationsEnabled}
              onChange={setNotificationsEnabled}
            />

            <FormSwitch
              label="Notification Sound"
              description="Play sound when receiving notifications"
              value={soundEnabled}
              onChange={setSoundEnabled}
              disabled={!notificationsEnabled}
            />

            <FormSwitch
              label="Vibration"
              description="Vibrate when receiving notifications"
              value={vibrationEnabled}
              onChange={setVibrationEnabled}
              disabled={!notificationsEnabled}
            />

            <FormSwitch
              label="Quiet Hours"
              description="Silence notifications during quiet hours"
              value={quietHoursEnabled}
              onChange={setQuietHoursEnabled}
              disabled={!notificationsEnabled}
            />

            <FormSwitch
              label="Show on Lock Screen"
              description="Display notifications on lock screen"
              value={showOnLockScreen}
              onChange={setShowOnLockScreen}
              disabled={!notificationsEnabled}
            />

            <FormSwitch
              label="Group Notifications"
              description="Group related notifications together"
              value={groupNotifications}
              onChange={setGroupNotifications}
              disabled={!notificationsEnabled}
            />
          </Card.Body>
        </Card>

        {/* Preview Style */}
        <Card className="mb-4 rounded-xl">
          <Card.Body style={{ padding: 16, gap: 16 }}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Preview Style</Text>
            <Text style={[styles.sectionDescription, { color: colors.mutedForeground }]}>
              Choose when to show notification previews
            </Text>

            {(['always', 'whenUnlocked', 'never'] as const).map((style) => (
              <FormSwitch
                key={style}
                label={
                  style === 'always'
                    ? 'Always'
                    : style === 'whenUnlocked'
                    ? 'When Unlocked'
                    : 'Never'
                }
                description={
                  style === 'always'
                    ? 'Always show notification previews'
                    : style === 'whenUnlocked'
                    ? 'Show previews only when device is unlocked'
                    : 'Never show notification previews'
                }
                value={previewStyle === style}
                onChange={(value) => value && setPreviewStyle(style)}
                disabled={!notificationsEnabled}
              />
            ))}
          </Card.Body>
        </Card>

        {/* Category Settings */}
        <Card className="mb-4 rounded-xl">
          <Card.Body style={{ padding: 16, gap: 16 }}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Category Settings</Text>
            <Text style={[styles.sectionDescription, { color: colors.mutedForeground }]}>
              Configure notifications for each category
            </Text>

            {(['system', 'messages', 'updates', 'alerts'] as NotificationCategory[]).map((category) => (
              <View key={category} style={styles.categorySection}>
                <Text style={[styles.categoryTitle, { color: colors.foreground }]}>
                  {getCategoryLabel(category)}
                </Text>

                <FormSwitch
                  label={`Enable ${getCategoryLabel(category)} Notifications`}
                  value={categorySettings[category]}
                  onChange={(value) =>
                    setCategorySettings((prev) => ({ ...prev, [category]: value }))
                  }
                  disabled={!notificationsEnabled}
                />

                <FormSwitch
                  label="Sound"
                  description={`Play sound for ${getCategoryLabel(category).toLowerCase()} notifications`}
                  value={categorySounds[category]}
                  onChange={(value) =>
                    setCategorySounds((prev) => ({ ...prev, [category]: value }))
                  }
                  disabled={!notificationsEnabled || !categorySettings[category] || !soundEnabled}
                />
              </View>
            ))}
          </Card.Body>
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <FormButton title="Save Settings" onPress={handleSave} variant="primary" fullWidth />
          <FormButton
            title="Reset to Defaults"
            onPress={handleReset}
            variant="outline"
            fullWidth
            style={styles.resetButton}
          />
        </View>
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
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  categorySection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148,163,184,0.2)',
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  actions: {
    gap: 12,
    marginTop: 8,
    marginBottom: 32,
  },
  resetButton: {
    marginTop: 8,
  },
});

