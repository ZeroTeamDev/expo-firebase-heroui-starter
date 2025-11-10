/**
 * User Management Screen
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Admin screen for managing users with comprehensive features
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { useTheme } from 'heroui-native';
import { AppHeader } from '@/components/layout/AppHeader';
import { useTabBarPadding } from '@/hooks/use-tab-bar-padding';
import { AdminOnly } from '@/components/permissions/AdminOnly';
import { useUsers, useUpdateUser, useUpdateUserRole, useAssignUserToGroup, useRemoveUserFromGroup, useUserFileStats } from '@/hooks/use-users';
import { useToast } from '@/components/feedback/Toast';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { UserDetail } from '@/components/users/UserDetail';
import { UserForm, type UserFormData } from '@/components/users/UserForm';
import { useAuthStore } from '@/stores/authStore';
import { useCanManageUsers, useUserRole } from '@/hooks/use-permissions';
import { useGroups } from '@/hooks/use-groups';
import type { UserProfile } from '@/services/permissions/permission.service';
import type { UserRole } from '@/utils/permissions';
import { canAssignRole } from '@/utils/permissions';

export default function UserManagementScreen() {
  const { colors, theme } = useTheme();
  const bottomPadding = useTabBarPadding();
  const user = useAuthStore((state) => state.user);
  const currentUserRole = useUserRole();
  const { canManage: canManageUsers } = useCanManageUsers();
  const { showToast } = useToast();

  // Search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [groupFilter, setGroupFilter] = useState<string | 'all' | 'none'>('all');

  // Modals
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<(UserProfile & { id: string }) | null>(null);

  // Hooks
  const { users, loading } = useUsers();
  const { groups } = useGroups();
  const { update: updateUser, updating } = useUpdateUser();
  const { updateRole, updating: updatingRole } = useUpdateUserRole();
  const { assign: assignToGroup, assigning } = useAssignUserToGroup();
  const { remove: removeFromGroup, removing } = useRemoveUserFromGroup();
  const { stats: userStats, loading: loadingStats } = useUserFileStats(selectedUser?.id || null);

  // Auto-update selectedUser when users list changes (real-time update)
  useEffect(() => {
    if (selectedUser) {
      const updatedUser = users.find((u) => u.id === selectedUser.id);
      if (updatedUser) {
        // Only update if something actually changed to avoid unnecessary re-renders
        if (
          updatedUser.groupId !== selectedUser.groupId ||
          updatedUser.role !== selectedUser.role ||
          updatedUser.displayName !== selectedUser.displayName
        ) {
          setSelectedUser(updatedUser);
        }
      }
    }
  }, [users, selectedUser?.id]);

  // Filter users by search query, role, and group
  const filteredUsers = useMemo(() => {
    let result = users;

    // Filter by role
    if (roleFilter !== 'all') {
      result = result.filter((u) => (u.role || 'user') === roleFilter);
    }

    // Filter by group
    if (groupFilter !== 'all') {
      if (groupFilter === 'none') {
        result = result.filter((u) => !u.groupId);
      } else {
        result = result.filter((u) => u.groupId === groupFilter);
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          (u.email || '').toLowerCase().includes(query) ||
          (u.displayName || u.email?.split('@')[0] || '').toLowerCase().includes(query)
      );
    }

    return result;
  }, [users, searchQuery, roleFilter, groupFilter]);

  const handleViewUser = (userItem: UserProfile & { id: string }) => {
    setSelectedUser(userItem);
    setShowDetailModal(true);
  };

  const handleEditUser = (userItem: UserProfile & { id: string }) => {
    setSelectedUser(userItem);
    setShowEditModal(true);
  };

  const handleUpdateUser = async (data: UserFormData) => {
    if (!selectedUser?.id || !user?.uid) return;

    try {
      // Update displayName if changed
      if (data.displayName !== selectedUser.displayName) {
        await updateUser(selectedUser.id, {
          displayName: data.displayName,
        });
      }

      // Update role if changed and allowed
      if (data.role !== selectedUser.role && currentUserRole) {
        const canAssign = canAssignRole(currentUserRole, data.role);
        if (canAssign) {
          await updateRole(selectedUser.id, data.role);
        } else {
          throw new Error('You do not have permission to assign this role');
        }
      }

      // Update group if changed
      const currentGroupId = selectedUser.groupId || null;
      const newGroupId = data.groupId || null;
      if (newGroupId !== currentGroupId) {
        if (newGroupId) {
          await assignToGroup(selectedUser.id, newGroupId);
        } else {
          await removeFromGroup(selectedUser.id);
        }
      }

      setShowEditModal(false);
      
      // Wait a bit for the real-time update to propagate, then refresh selectedUser
      // This ensures the user list is updated before we close the modal
      setTimeout(() => {
        const updatedUser = users.find((u) => u.id === selectedUser.id);
        if (updatedUser) {
          setSelectedUser(updatedUser);
        }
      }, 500);
      showToast({
        title: 'Success',
        message: 'User updated successfully',
        variant: 'success',
      });
    } catch (error) {
      showToast({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to update user',
        variant: 'error',
      });
    }
  };

  const handleRoleChange = async (newRole: UserRole) => {
    if (!selectedUser?.id || !currentUserRole) return;

    try {
      const canAssign = canAssignRole(currentUserRole, newRole);
      if (!canAssign) {
        showToast({
          title: 'Error',
          message: 'You do not have permission to assign this role',
          variant: 'error',
        });
        return;
      }

      await updateRole(selectedUser.id, newRole);
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

  const handleGroupChange = async (groupId: string | null) => {
    if (!selectedUser?.id) return;

    try {
      if (groupId) {
        await assignToGroup(selectedUser.id, groupId);
        showToast({
          title: 'Success',
          message: 'User assigned to group successfully',
          variant: 'success',
        });
      } else {
        await removeFromGroup(selectedUser.id);
        showToast({
          title: 'Success',
          message: 'User removed from group successfully',
          variant: 'success',
        });
      }
    } catch (error) {
      showToast({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to update user group',
        variant: 'error',
      });
    }
  };

  const handleRemoveFromGroup = async () => {
    if (!selectedUser?.id) return;

    Alert.alert(
      'Remove from Group',
      'Are you sure you want to remove this user from their group?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await handleGroupChange(null);
          },
        },
      ]
    );
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
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

  const renderUserItem = ({ item }: { item: UserProfile & { id: string } }) => {
    const userGroup = groups.find((g) => g.id === item.groupId);
    const displayName = item.displayName || item.email?.split('@')[0] || 'User';
    const displayNameInitial = displayName.charAt(0).toUpperCase();
    const userRole = item.role || 'user';

    return (
      <TouchableOpacity
        style={[styles.userItem, { backgroundColor: colors.surface1 }]}
        onPress={() => handleViewUser(item)}
        activeOpacity={0.7}
      >
        <View style={styles.userItemContent}>
          <View
            style={[
              styles.userAvatar,
              {
                backgroundColor: getRoleColor(userRole),
              },
            ]}
          >
            <Text style={[styles.avatarText, { color: '#ffffff' }]}>
              {displayNameInitial}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.foreground }]}>
              {displayName}
            </Text>
            <Text style={[styles.userEmail, { color: colors.mutedForeground }]}>
              {item.email || 'No email'}
            </Text>
            <View style={styles.userMeta}>
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
              {userGroup && (
                <View style={[styles.groupBadge, { backgroundColor: colors.surface2 }]}>
                  <Text style={[styles.groupBadgeText, { color: colors.foreground }]}>
                    {userGroup.name}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              handleEditUser(item);
            }}
            style={styles.editButton}
          >
            <IconSymbol name="pencil" size={20} color={colors.accent} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFilterPill = (
    label: string,
    value: string,
    currentValue: string,
    onPress: () => void
  ) => {
    const isActive = value === currentValue;
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.filterPill,
          {
            backgroundColor: isActive ? colors.accent : colors.surface1,
            borderColor: isActive ? colors.accent : colors.border,
          },
        ]}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.filterPillText,
            {
              color: isActive ? '#ffffff' : colors.foreground,
            },
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
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

        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: colors.surface1 }]}>
          <IconSymbol name="magnifyingglass" size={20} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder="Search by email or name..."
            placeholderTextColor={colors.mutedForeground}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <IconSymbol name="xmark.circle.fill" size={20} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <View style={styles.filterSection}>
            <Text style={[styles.filterLabel, { color: colors.mutedForeground }]}>Role:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterPillsScroll}>
              <View style={styles.filterPills}>
                {renderFilterPill('All', 'all', roleFilter, () => setRoleFilter('all'))}
                {(['admin', 'moderator', 'editor', 'user'] as UserRole[]).map((role) => (
                  <View key={role}>
                    {renderFilterPill(
                      role.charAt(0).toUpperCase() + role.slice(1),
                      role,
                      roleFilter,
                      () => setRoleFilter(role)
                    )}
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.filterSection}>
            <Text style={[styles.filterLabel, { color: colors.mutedForeground }]}>Group:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterPillsScroll}>
              <View style={styles.filterPills}>
                {renderFilterPill('All', 'all', groupFilter, () => setGroupFilter('all'))}
                {renderFilterPill('No Group', 'none', groupFilter, () => setGroupFilter('none'))}
                {groups.map((group) => (
                  <View key={group.id}>
                    {renderFilterPill(group.name, group.id, groupFilter, () =>
                      setGroupFilter(group.id)
                    )}
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>

        {/* User List */}
        {filteredUsers.length === 0 ? (
          <View style={styles.empty}>
            <IconSymbol name="person.fill" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              {searchQuery ? 'No users found' : 'No users'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredUsers}
            renderItem={renderUserItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[styles.list, { paddingBottom: bottomPadding }]}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* User Detail Modal */}
        <Modal
          visible={showDetailModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowDetailModal(false)}
        >
          <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>User Details</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowDetailModal(false);
                  setSelectedUser(null);
                }}
              >
                <IconSymbol name="xmark.circle.fill" size={24} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>
            {selectedUser && (
              <UserDetail
                user={selectedUser}
                stats={userStats}
                onEdit={() => {
                  setShowDetailModal(false);
                  handleEditUser(selectedUser);
                }}
                onRoleChange={handleRoleChange}
                onGroupChange={handleGroupChange}
                onRemoveFromGroup={handleRemoveFromGroup}
                canEdit={canManageUsers}
                canAssignRole={canManageUsers && currentUserRole ? true : false}
                canManageGroups={canManageUsers}
                loadingStats={loadingStats}
              />
            )}
          </View>
        </Modal>

        {/* User Edit Modal */}
        <Modal
          visible={showEditModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowEditModal(false)}
        >
          <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>Edit User</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowEditModal(false);
                  setSelectedUser(null);
                }}
              >
                <IconSymbol name="xmark.circle.fill" size={24} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>
            {selectedUser && (
              <UserForm
                user={selectedUser}
                onSubmit={handleUpdateUser}
                onCancel={() => {
                  setShowEditModal(false);
                  setSelectedUser(null);
                }}
                loading={updating || updatingRole || assigning || removing}
                canAssignRole={canManageUsers && currentUserRole ? true : false}
                canManageGroups={canManageUsers}
              />
            )}
          </View>
        </Modal>
      </View>
    </AdminOnly>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  filterSection: {
    gap: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  filterPillsScroll: {
    marginVertical: 8,
  },
  filterPills: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 16,
  },
  filterPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '500',
  },
  list: {
    padding: 16,
  },
  userItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  userItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 8,
  },
  userMeta: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  roleBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  roleBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  groupBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  groupBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  editButton: {
    padding: 8,
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
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 16,
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
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
});
