/**
 * User Detail Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Display user details, statistics, and management options
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from 'heroui-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { UserRoleSelector } from './UserRoleSelector';
import { UserGroupSelector } from './UserGroupSelector';
import type { UserProfile } from '@/services/permissions/permission.service';
import type { UserRole } from '@/utils/permissions';
import type { UserStats } from '@/services/users/user.service';

interface UserDetailProps {
  user: UserProfile & { id: string };
  stats: UserStats | null;
  onEdit: () => void;
  onRoleChange: (role: UserRole) => void;
  onGroupChange: (groupId: string | null) => void;
  onRemoveFromGroup: () => void;
  canEdit: boolean;
  canAssignRole: boolean;
  canManageGroups: boolean;
  loadingStats?: boolean;
}

export function UserDetail({
  user,
  stats,
  onEdit,
  onRoleChange,
  onGroupChange,
  onRemoveFromGroup,
  canEdit,
  canAssignRole,
  canManageGroups,
  loadingStats = false,
}: UserDetailProps) {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  const getRoleColor = (role: UserRole | string | undefined) => {
    const userRole = role || 'user';
    switch (userRole) {
      case 'admin':
        return colors.danger || '#dc2626';
      case 'moderator':
        return colors.warning || '#d97706';
      case 'editor':
        return colors.accent || '#4f46e5';
      case 'user':
        return colors.muted || '#6b7280';
      default:
        return colors.muted;
    }
  };

  const userRole = user.role || 'user';
  const displayName = user.displayName || user.email?.split('@')[0] || 'User';

  const formatDate = (date: any) => {
    if (!date) return 'Never';
    try {
      const d = date.toDate ? date.toDate() : new Date(date);
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* User Info Card */}
      <View style={[styles.card, { backgroundColor: colors.surface1 }]}>
        <View style={styles.cardHeader}>
          <View style={styles.userHeader}>
            <View
              style={[
                styles.avatar,
                {
                  backgroundColor: getRoleColor(userRole),
                },
              ]}
            >
              <Text style={styles.avatarText}>
                {displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: colors.foreground }]}>
                {displayName}
              </Text>
              <Text style={[styles.userEmail, { color: colors.mutedForeground }]}>
                {user.email || 'No email'}
              </Text>
            </View>
          </View>
          {canEdit && (
            <TouchableOpacity onPress={onEdit} style={styles.editButton}>
              <IconSymbol name="pencil" size={20} color={colors.accent} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Role</Text>
          {canAssignRole ? (
            <UserRoleSelector
              currentRole={userRole as UserRole}
              onRoleChange={onRoleChange}
              disabled={!canAssignRole}
            />
          ) : (
            <View
              style={[
                styles.roleBadge,
                {
                  backgroundColor: getRoleColor(userRole),
                },
              ]}
            >
              <Text style={styles.roleBadgeText}>
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Group</Text>
          {canManageGroups ? (
            <UserGroupSelector
              currentGroupId={user.groupId}
              onGroupChange={onGroupChange}
              disabled={!canManageGroups}
            />
          ) : (
            <Text style={[styles.infoValue, { color: colors.foreground }]}>
              {user.groupId ? 'In Group' : 'No Group'}
            </Text>
          )}
        </View>

        {user.groupId && canManageGroups && (
          <TouchableOpacity
            onPress={onRemoveFromGroup}
            style={[styles.removeGroupButton, { borderColor: colors.danger }]}
          >
            <IconSymbol name="person.crop.circle.badge.minus" size={16} color={colors.danger} />
            <Text style={[styles.removeGroupText, { color: colors.danger }]}>
              Remove from Group
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Statistics Card */}
      <View style={[styles.card, { backgroundColor: colors.surface1 }]}>
        <Text style={[styles.cardTitle, { color: colors.foreground }]}>Statistics</Text>
        <View style={styles.divider} />

        {loadingStats ? (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
              Loading statistics...
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.foreground }]}>
                  {stats?.fileUploadCount || 0}
                </Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                  Files Uploaded
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>
                Last Upload
              </Text>
              <Text style={[styles.infoValue, { color: colors.foreground }]}>
                {formatDate(stats?.lastFileUploadAt)}
              </Text>
            </View>
          </>
        )}
      </View>

      {/* Account Info Card */}
      <View style={[styles.card, { backgroundColor: colors.surface1 }]}>
        <Text style={[styles.cardTitle, { color: colors.foreground }]}>Account Information</Text>
        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Created At</Text>
          <Text style={[styles.infoValue, { color: colors.foreground }]}>
            {formatDate(user.createdAt)}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Updated At</Text>
          <Text style={[styles.infoValue, { color: colors.foreground }]}>
            {formatDate(user.updatedAt)}
          </Text>
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
    padding: 16,
    gap: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  editButton: {
    padding: 8,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginVertical: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  roleBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  roleBadgeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  removeGroupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
    gap: 8,
  },
  removeGroupText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
  },
});

