/**
 * User Management Screen
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Admin screen for managing users and roles
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useTheme } from 'heroui-native';
import { AppHeader } from '@/components/layout/AppHeader';
import { useTabBarPadding } from '@/hooks/use-tab-bar-padding';
import { AdminOnly } from '@/components/permissions/AdminOnly';
import { listUsers, updateUserRole } from '@/services/users/user.service';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/components/feedback/Toast';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { UserProfile } from '@/services/permissions/permission.service';
import type { UserRole } from '@/utils/permissions';

export default function UserManagementScreen() {
  const { colors, theme } = useTheme();
  const bottomPadding = useTabBarPadding();
  const user = useAuthStore((state) => state.user);
  const { showToast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    if (!user?.uid) return;

    setLoading(true);
    try {
      const userList = await listUsers();
      setUsers(userList);
    } catch (error) {
      showToast({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to load users',
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    if (!user?.uid) return;

    try {
      await updateUserRole(userId, newRole, user.uid);
      await loadUsers();
      showToast({
        title: 'Success',
        message: 'User role updated successfully',
        variant: 'success',
      });
    } catch (error) {
      showToast({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to update user role',
        variant: 'error',
      });
    }
  };

  const renderUserItem = ({ item }: { item: UserProfile }) => {
    return (
      <View style={[styles.userItem, { backgroundColor: colors.surface1 }]}>
        <View style={styles.userInfo}>
          <Text style={[styles.userEmail, { color: colors.foreground }]}>
            {item.email}
          </Text>
          <Text style={[styles.userRole, { color: colors.mutedForeground }]}>
            Role: {item.role}
          </Text>
          {item.groupId && (
            <Text style={[styles.userGroup, { color: colors.mutedForeground }]}>
              Group: {item.groupId}
            </Text>
          )}
        </View>
        <View style={styles.roleSelector}>
          {(['admin', 'moderator', 'editor', 'user'] as UserRole[]).map((role) => (
            <TouchableOpacity
              key={role}
              onPress={() => handleRoleChange(item.id || '', role)}
              style={[
                styles.roleButton,
                {
                  backgroundColor: item.role === role ? colors.accent : colors.surface2,
                },
              ]}
            >
              <Text
                style={[
                  styles.roleButtonText,
                  {
                    color: item.role === role ? '#fff' : colors.foreground,
                  },
                ]}
              >
                {role}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <AppHeader title="User Management" />
        <View style={styles.loading}>
          <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
            Loading users...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <AdminOnly
      fallback={
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <AppHeader title="User Management" />
          <View style={styles.unauthorized}>
            <Text style={[styles.unauthorizedText, { color: colors.foreground }]}>
              You do not have permission to access this area.
            </Text>
          </View>
        </View>
      }
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <AppHeader title="User Management" />
        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={(item, index) => (item as any).id || item.email || `user-${index}`}
          contentContainerStyle={[styles.list, { paddingBottom: bottomPadding }]}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </AdminOnly>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  userItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  userInfo: {
    marginBottom: 12,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    marginBottom: 2,
  },
  userGroup: {
    fontSize: 12,
  },
  roleSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  roleButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  roleButtonText: {
    fontSize: 12,
    fontWeight: '500',
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
});

