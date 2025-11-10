/**
 * Group Permissions Editor Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Component for editing group permissions
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useTheme } from 'heroui-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { FormInput } from '@/components/forms/FormInput';
import type { GroupPermissions } from '@/services/permissions/permission.service';

interface GroupPermissionsEditorProps {
  permissions: GroupPermissions;
  onChange: (permissions: GroupPermissions) => void;
  disabled?: boolean;
}

export function GroupPermissionsEditor({
  permissions,
  onChange,
  disabled = false,
}: GroupPermissionsEditorProps) {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  const updatePermission = (key: keyof GroupPermissions, value: boolean | number | string[]) => {
    onChange({
      ...permissions,
      [key]: value,
    });
  };

  const togglePermission = (key: keyof GroupPermissions) => {
    if (typeof permissions[key] === 'boolean') {
      updatePermission(key, !permissions[key]);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const parseFileSize = (input: string): number | null => {
    const trimmed = input.trim().toLowerCase();
    if (!trimmed) return null;

    // Try to parse as number (bytes)
    const numberMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*(kb|mb|gb|b)?$/);
    if (!numberMatch) return null;

    const value = parseFloat(numberMatch[1]);
    const unit = numberMatch[2] || 'b';

    switch (unit) {
      case 'gb':
        return Math.round(value * 1024 * 1024 * 1024);
      case 'mb':
        return Math.round(value * 1024 * 1024);
      case 'kb':
        return Math.round(value * 1024);
      case 'b':
      default:
        return Math.round(value);
    }
  };

  // Format file size for input (e.g., "10MB" instead of "10.00 MB")
  const formatFileSizeForInput = (bytes: number | undefined): string => {
    if (!bytes) return '10MB';
    const formatted = formatFileSize(bytes);
    // Extract number and unit, remove decimals if whole number
    const match = formatted.match(/(\d+(?:\.\d+)?)\s*(KB|MB|GB|B)/);
    if (match) {
      const num = parseFloat(match[1]);
      const unit = match[2];
      return num % 1 === 0 ? `${Math.round(num)}${unit}` : formatted.replace(/\s/g, '');
    }
    return formatted.replace(/\s/g, '');
  };

  const [maxFileSizeInput, setMaxFileSizeInput] = useState<string>(
    formatFileSizeForInput(permissions.maxFileSize)
  );
  const [maxFileCountInput, setMaxFileCountInput] = useState<string>(
    String(permissions.maxFileCount || 100)
  );

  // Sync inputs when permissions change externally
  useEffect(() => {
    setMaxFileSizeInput(formatFileSizeForInput(permissions.maxFileSize));
    setMaxFileCountInput(String(permissions.maxFileCount || 100));
  }, [permissions.maxFileSize, permissions.maxFileCount]);

  const PermissionToggle = ({
    label,
    description,
    value,
    onToggle,
  }: {
    label: string;
    description?: string;
    value: boolean;
    onToggle: () => void;
  }) => (
    <TouchableOpacity
      onPress={onToggle}
      disabled={disabled}
      style={[
        styles.permissionItem,
        {
          backgroundColor: colors.surface1,
          borderColor: colors.border,
        },
        disabled && styles.disabled,
      ]}
      activeOpacity={0.7}
    >
      <View style={styles.permissionInfo}>
        <Text style={[styles.permissionLabel, { color: colors.foreground }]}>{label}</Text>
        {description && (
          <Text style={[styles.permissionDescription, { color: colors.mutedForeground }]}>
            {description}
          </Text>
        )}
      </View>
      <View
        style={[
          styles.toggle,
          {
            backgroundColor: value ? colors.accent : colors.muted,
          },
        ]}
      >
        <View
          style={[
            styles.toggleThumb,
            {
              backgroundColor: '#ffffff',
              transform: [{ translateX: value ? 20 : 0 }],
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>File Permissions</Text>

        <PermissionToggle
          label="Can View Files"
          description="Members can view files in this group"
          value={permissions.canViewFiles ?? true}
          onToggle={() => togglePermission('canViewFiles')}
        />

        <PermissionToggle
          label="Can Upload Files"
          description="Members can upload files to this group"
          value={permissions.canUploadFiles ?? true}
          onToggle={() => togglePermission('canUploadFiles')}
        />

        <PermissionToggle
          label="Can Delete Files"
          description="Members can delete files in this group"
          value={permissions.canDeleteFiles ?? true}
          onToggle={() => togglePermission('canDeleteFiles')}
        />

        <PermissionToggle
          label="Can Share Files"
          description="Members can share files from this group"
          value={permissions.canShareFiles ?? true}
          onToggle={() => togglePermission('canShareFiles')}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Group Management</Text>

        <PermissionToggle
          label="Can Manage Members"
          description="Members can add/remove other members"
          value={permissions.canManageMembers ?? false}
          onToggle={() => togglePermission('canManageMembers')}
        />

        <PermissionToggle
          label="Can Edit Group"
          description="Members can edit group name and description"
          value={permissions.canEditGroup ?? false}
          onToggle={() => togglePermission('canEditGroup')}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>File Limits</Text>
        <Text style={[styles.sectionDescription, { color: colors.mutedForeground }]}>
          These limits apply to all users in this group
        </Text>

        <View style={styles.limitInputContainer}>
          <View style={styles.limitInputLabel}>
            <Text style={[styles.limitLabel, { color: colors.foreground }]}>Max File Size</Text>
            <Text style={[styles.limitDescription, { color: colors.mutedForeground }]}>
              Maximum size for a single file (e.g., 10MB, 100KB, 1GB)
            </Text>
          </View>
          <View style={[styles.limitInputWrapper, { backgroundColor: colors.surface1, borderColor: colors.border }]}>
            <TextInput
              style={[styles.limitInput, { color: colors.foreground }]}
              value={maxFileSizeInput}
              onChangeText={(text) => {
                setMaxFileSizeInput(text);
                const parsed = parseFileSize(text);
                if (parsed !== null && parsed > 0) {
                  updatePermission('maxFileSize', parsed);
                }
              }}
              placeholder="10MB"
              placeholderTextColor={colors.mutedForeground}
              editable={!disabled}
            />
            {permissions.maxFileSize && (
              <Text style={[styles.limitInputHint, { color: colors.mutedForeground }]}>
                = {formatFileSize(permissions.maxFileSize)}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.limitInputContainer}>
          <View style={styles.limitInputLabel}>
            <Text style={[styles.limitLabel, { color: colors.foreground }]}>Max File Count</Text>
            <Text style={[styles.limitDescription, { color: colors.mutedForeground }]}>
              Maximum number of files allowed in this group
            </Text>
          </View>
          <View style={[styles.limitInputWrapper, { backgroundColor: colors.surface1, borderColor: colors.border }]}>
            <TextInput
              style={[styles.limitInput, { color: colors.foreground }]}
              value={maxFileCountInput}
              onChangeText={(text) => {
                setMaxFileCountInput(text);
                const parsed = parseInt(text, 10);
                if (!isNaN(parsed) && parsed > 0) {
                  updatePermission('maxFileCount', parsed);
                }
              }}
              placeholder="100"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="numeric"
              editable={!disabled}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  permissionInfo: {
    flex: 1,
    marginRight: 12,
  },
  permissionLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  permissionDescription: {
    fontSize: 13,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionDescription: {
    fontSize: 13,
    marginBottom: 16,
    marginTop: -4,
  },
  limitInputContainer: {
    marginBottom: 16,
  },
  limitInputLabel: {
    marginBottom: 8,
  },
  limitLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  limitDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  limitInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  limitInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
  },
  limitInputHint: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  disabled: {
    opacity: 0.5,
  },
});

