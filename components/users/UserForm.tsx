/**
 * User Form Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Form for editing user information
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from 'heroui-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormInput } from '@/components/forms/FormInput';
import { UserRoleSelector } from './UserRoleSelector';
import { UserGroupSelector } from './UserGroupSelector';
import type { UserProfile } from '@/services/permissions/permission.service';
import type { UserRole } from '@/utils/permissions';

const userFormSchema = z.object({
  displayName: z.string().min(1, 'Display name is required').max(100, 'Display name is too long'),
  role: z.enum(['admin', 'moderator', 'editor', 'user']),
  groupId: z.string().nullable().optional(),
});

export type UserFormData = z.infer<typeof userFormSchema>;

interface UserFormProps {
  user: UserProfile & { id: string };
  onSubmit: (data: UserFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  canAssignRole?: boolean;
  canManageGroups?: boolean;
}

export function UserForm({
  user,
  onSubmit,
  onCancel,
  loading = false,
  canAssignRole = true,
  canManageGroups = true,
}: UserFormProps) {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      displayName: user.displayName || user.email?.split('@')[0] || '',
      role: user.role || 'user',
      groupId: user.groupId || null,
    },
  });

  const currentRole = watch('role');
  const currentGroupId = watch('groupId');

  // Update form when user changes, including when user is updated after save
  useEffect(() => {
    if (user) {
      reset({
        displayName: user.displayName || user.email?.split('@')[0] || '',
        role: user.role || 'user',
        groupId: user.groupId || null,
      }, {
        keepDefaultValues: false, // Reset to new user values
      });
    }
  }, [user.id, user.displayName, user.role, user.groupId, reset]);

  const handleFormSubmit = async (data: UserFormData) => {
    await onSubmit(data);
  };

  const handleRoleChange = (role: UserRole) => {
    setValue('role', role, { shouldValidate: true });
  };

  const handleGroupChange = (groupId: string | null) => {
    setValue('groupId', groupId || null, { shouldValidate: true });
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
          name="displayName"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label="Display Name"
              placeholder="Enter display name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.displayName?.message}
              editable={!loading}
              autoCapitalize="words"
              containerStyle={styles.fieldContainer}
            />
          )}
        />

        <View style={styles.fieldContainer}>
          <Text style={[styles.fieldLabel, { color: colors.foreground }]}>Role</Text>
          {canAssignRole ? (
            <UserRoleSelector
              currentRole={currentRole}
              onRoleChange={handleRoleChange}
              disabled={loading || !canAssignRole}
            />
          ) : (
            <View
              style={[
                styles.readOnlyField,
                {
                  backgroundColor: colors.surface1,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.readOnlyText, { color: colors.foreground }]}>
                {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}
              </Text>
            </View>
          )}
          {errors.role && (
            <Text style={[styles.errorText, { color: colors.danger }]}>
              {errors.role.message}
            </Text>
          )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={[styles.fieldLabel, { color: colors.foreground }]}>Group</Text>
          {canManageGroups ? (
            <UserGroupSelector
              currentGroupId={currentGroupId || null}
              onGroupChange={handleGroupChange}
              disabled={loading || !canManageGroups}
            />
          ) : (
            <View
              style={[
                styles.readOnlyField,
                {
                  backgroundColor: colors.surface1,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.readOnlyText, { color: colors.foreground }]}>
                {currentGroupId ? 'In Group' : 'No Group'}
              </Text>
            </View>
          )}
          {errors.groupId && (
            <Text style={[styles.errorText, { color: colors.danger }]}>
              {errors.groupId.message}
            </Text>
          )}
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
                Update User
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
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  readOnlyField: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    minHeight: 44,
    justifyContent: 'center',
  },
  readOnlyText: {
    fontSize: 14,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
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

