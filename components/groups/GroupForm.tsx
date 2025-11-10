/**
 * Group Form Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Form for creating and editing groups
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from 'heroui-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormInput } from '@/components/forms/FormInput';
import { GroupPermissionsEditor } from './GroupPermissionsEditor';
import type { GroupMetadata, GroupPermissions } from '@/services/permissions/permission.service';

const groupSchema = z.object({
  name: z.string().min(1, 'Group name is required').max(100, 'Group name is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  permissions: z.object({
    canUploadFiles: z.boolean().optional(),
    canDeleteFiles: z.boolean().optional(),
    canShareFiles: z.boolean().optional(),
    canManageMembers: z.boolean().optional(),
    canEditGroup: z.boolean().optional(),
    canViewFiles: z.boolean().optional(),
    maxFileSize: z.number().optional(),
    maxFileCount: z.number().optional(),
    allowedFileTypes: z.array(z.string()).optional(),
  }).optional(),
});

export type GroupFormData = z.infer<typeof groupSchema>;

interface GroupFormProps {
  group?: GroupMetadata;
  onSubmit: (data: GroupFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function GroupForm({ group, onSubmit, onCancel, loading }: GroupFormProps) {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  // Default permissions
  const defaultPermissions: GroupPermissions = {
    canUploadFiles: true,
    canDeleteFiles: true,
    canShareFiles: true,
    canManageMembers: false,
    canEditGroup: false,
    canViewFiles: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxFileCount: 100,
    allowedFileTypes: [],
  };

  const [permissions, setPermissions] = useState<GroupPermissions>(
    group?.permissions || defaultPermissions
  );
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: group?.name || '',
      description: group?.description || '',
      permissions: group?.permissions || defaultPermissions,
    },
  });

  useEffect(() => {
    if (group) {
      reset({
        name: group.name,
        description: group.description || '',
        permissions: group.permissions || defaultPermissions,
      });
      setPermissions(group.permissions || defaultPermissions);
    }
  }, [group, reset]);

  useEffect(() => {
    setValue('permissions', permissions);
  }, [permissions, setValue]);

  const handleFormSubmit = async (data: GroupFormData) => {
    await onSubmit({
      ...data,
      permissions,
    });
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.form}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label="Group Name"
              placeholder="Enter group name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.name?.message}
              editable={!loading}
              autoCapitalize="words"
              containerStyle={styles.fieldContainer}
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label="Description (Optional)"
              placeholder="Enter group description"
              value={value || ''}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.description?.message}
              editable={!loading}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              containerStyle={styles.fieldContainer}
            />
          )}
        />

        {/* Permissions Section */}
        <View style={styles.permissionsSection}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Group Permissions</Text>
          <GroupPermissionsEditor
            permissions={permissions}
            onChange={setPermissions}
            disabled={loading}
          />
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={onCancel}
            disabled={loading}
            style={[
              styles.button,
              styles.cancelButton,
              {
                backgroundColor: colors.surface1 || (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'),
                borderColor: colors.border || (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'),
              },
              loading && styles.buttonDisabled,
            ]}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.buttonText,
                styles.cancelButtonText,
                { color: colors.foreground },
              ]}
            >
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSubmit(handleFormSubmit)}
            disabled={loading}
            style={[
              styles.button,
              styles.submitButton,
              {
                backgroundColor: colors.accent,
              },
              loading && styles.buttonDisabled,
            ]}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text
                style={[
                  styles.buttonText,
                  styles.submitButtonText,
                  { color: colors.accentForeground || '#ffffff' },
                ]}
              >
                {group ? 'Update Group' : 'Create Group'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  form: {
    padding: 20,
    gap: 4,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  permissionsSection: {
    marginTop: 8,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    borderWidth: 1,
  },
  cancelButton: {
    // Styling applied via inline styles
  },
  submitButton: {
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    // Color applied via inline styles
  },
  submitButtonText: {
    // Color applied via inline styles
  },
});

