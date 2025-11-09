/**
 * Global Configuration Screen
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Admin screen for configuring app-wide settings
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from 'heroui-native';
import { AppHeader } from '@/components/layout/AppHeader';
import { useTabBarPadding } from '@/hooks/use-tab-bar-padding';
import { AdminOnly } from '@/components/permissions/AdminOnly';
import { useGlobalConfig } from '@/hooks/use-config';
import { updateGlobalConfig } from '@/services/config/global-config.service';
import { useAuthStore } from '@/stores/authStore';
import { FormButton } from '@/components/forms/FormButton';
import { FormSwitch } from '@/components/forms/FormSwitch';
import { useToast } from '@/components/feedback/Toast';

export default function GlobalConfigScreen() {
  const { colors, theme } = useTheme();
  const bottomPadding = useTabBarPadding();
  const { config, loading } = useGlobalConfig();
  const user = useAuthStore((state) => state.user);
  const { showToast } = useToast();

  // Local state for form
  const [formData, setFormData] = useState({
    enableRegistration: config?.enableRegistration ?? true,
    requireEmailVerification: config?.requireEmailVerification ?? false,
    enableFileManagement: config?.enableFileManagement ?? true,
    maxFileSize: config?.maxFileSize ?? 10485760,
    maxFileCount: config?.maxFileCount ?? 10,
    maxFileCountWithGroup: config?.maxFileCountWithGroup ?? 100,
    enablePermissions: config?.enablePermissions ?? false,
    enableGroups: config?.enableGroups ?? false,
    maintenanceMode: config?.maintenanceMode ?? false,
    maintenanceMessage: config?.maintenanceMessage ?? '',
  });

  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (config) {
      setFormData({
        enableRegistration: config.enableRegistration,
        requireEmailVerification: config.requireEmailVerification,
        enableFileManagement: config.enableFileManagement,
        maxFileSize: config.maxFileSize,
        maxFileCount: config.maxFileCount,
        maxFileCountWithGroup: config.maxFileCountWithGroup,
        enablePermissions: config.enablePermissions,
        enableGroups: config.enableGroups,
        maintenanceMode: config.maintenanceMode,
        maintenanceMessage: config.maintenanceMessage || '',
      });
    }
  }, [config]);

  const handleSave = async () => {
    if (!user?.uid) {
      showToast({
        title: 'Error',
        message: 'User not authenticated',
        variant: 'error',
      });
      return;
    }

    setSaving(true);
    try {
      await updateGlobalConfig(formData, user.uid);
      showToast({
        title: 'Success',
        message: 'Configuration saved successfully',
        variant: 'success',
      });
    } catch (error) {
      showToast({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to save configuration',
        variant: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <AppHeader title="Global Configuration" />
        <View style={styles.loading}>
          <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
            Loading configuration...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <AdminOnly
      fallback={
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <AppHeader title="Global Configuration" />
          <View style={styles.unauthorized}>
            <Text style={[styles.unauthorizedText, { color: colors.foreground }]}>
              You do not have permission to access this area.
            </Text>
          </View>
        </View>
      }
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <AppHeader title="Global Configuration" />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.content, { paddingBottom: bottomPadding }]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Authentication Settings
          </Text>
          <View style={[styles.section, { backgroundColor: colors.surface1 }]}>
            <FormSwitch
              label="Enable Registration"
              description="Allow new users to register"
              value={formData.enableRegistration}
              onChange={(value) => setFormData({ ...formData, enableRegistration: value })}
            />
            <FormSwitch
              label="Require Email Verification"
              description="Require email verification for new accounts"
              value={formData.requireEmailVerification}
              onChange={(value) => setFormData({ ...formData, requireEmailVerification: value })}
            />
          </View>

          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            File Management Settings
          </Text>
          <View style={[styles.section, { backgroundColor: colors.surface1 }]}>
            <FormSwitch
              label="Enable File Management"
              description="Enable file upload and management features"
              value={formData.enableFileManagement}
              onChange={(value) => setFormData({ ...formData, enableFileManagement: value })}
            />
            <Text style={[styles.label, { color: colors.foreground }]}>
              Max File Size: {Math.round(formData.maxFileSize / 1024 / 1024)} MB
            </Text>
            <Text style={[styles.label, { color: colors.foreground }]}>
              Max File Count (no group): {formData.maxFileCount}
            </Text>
            <Text style={[styles.label, { color: colors.foreground }]}>
              Max File Count (with group): {formData.maxFileCountWithGroup}
            </Text>
          </View>

          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Permission Settings
          </Text>
          <View style={[styles.section, { backgroundColor: colors.surface1 }]}>
            <FormSwitch
              label="Enable Permissions"
              description="Enable role-based access control (RBAC)"
              value={formData.enablePermissions}
              onChange={(value) => setFormData({ ...formData, enablePermissions: value })}
            />
            <FormSwitch
              label="Enable Groups"
              description="Enable group management features"
              value={formData.enableGroups}
              onChange={(value) => setFormData({ ...formData, enableGroups: value })}
            />
          </View>

          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            System Settings
          </Text>
          <View style={[styles.section, { backgroundColor: colors.surface1 }]}>
            <FormSwitch
              label="Maintenance Mode"
              description="Put app in maintenance mode"
              value={formData.maintenanceMode}
              onChange={(value) => setFormData({ ...formData, maintenanceMode: value })}
            />
          </View>

          <View style={styles.saveButton}>
            <FormButton
              title="Save Configuration"
              onPress={handleSave}
              disabled={saving}
              fullWidth
            />
          </View>
        </ScrollView>
      </View>
    </AdminOnly>
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
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 14,
  },
  unauthorized: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  unauthorizedText: {
    fontSize: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginTop: 8,
  },
  saveButton: {
    marginTop: 24,
    marginBottom: 16,
  },
});

