/**
 * Group Management Screen (Admin)
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Admin screen for managing groups with full CRUD
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, Alert } from 'react-native';
import { useTheme, Button } from 'heroui-native';
import { AppHeader } from '@/components/layout/AppHeader';
import { useTabBarPadding } from '@/hooks/use-tab-bar-padding';
import { AdminOnly } from '@/components/permissions/AdminOnly';
import { useGroups, useCreateGroup, useUpdateGroup, useDeleteGroup } from '@/hooks/use-groups';
import { useToast } from '@/components/feedback/Toast';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { GroupForm, type GroupFormData } from '@/components/groups/GroupForm';
import { GroupDetail } from '@/components/groups/GroupDetail';
import { useAuthStore } from '@/stores/authStore';
import { listUsers } from '@/services/users/user.service';
import type { GroupMetadata } from '@/services/permissions/permission.service';
import type { UserProfile } from '@/services/permissions/permission.service';

export default function AdminGroupManagementScreen() {
  const { colors, theme } = useTheme();
  const bottomPadding = useTabBarPadding();
  const user = useAuthStore((state) => state.user);
  const { groups, loading } = useGroups();
  const createGroupHook = useCreateGroup();
  const { update: updateGroup, updating } = useUpdateGroup();
  const { deleteGroup, deleting } = useDeleteGroup();
  const { showToast } = useToast();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<GroupMetadata | null>(null);
  const [groupMembers, setGroupMembers] = useState<(UserProfile & { id: string })[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  // Load members when group is selected
  useEffect(() => {
    if (selectedGroup && showDetailModal) {
      loadGroupMembers(selectedGroup);
    }
  }, [selectedGroup, showDetailModal]);

  const loadGroupMembers = async (group: GroupMetadata) => {
    setLoadingMembers(true);
    try {
      const allUsers = await listUsers();
      const members = allUsers.filter((u) => group.memberIds.includes(u.id));
      setGroupMembers(members);
    } catch (error) {
      showToast({
        title: 'Error',
        message: 'Failed to load group members',
        variant: 'error',
      });
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleCreateGroup = async (data: GroupFormData) => {
    if (!user?.uid) return;

    try {
      await createGroupHook.create({
        name: data.name,
        description: data.description,
        ownerId: user.uid,
      });
      setShowCreateModal(false);
      showToast({
        title: 'Success',
        message: 'Group created successfully',
        variant: 'success',
      });
    } catch (error) {
      showToast({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to create group',
        variant: 'error',
      });
    }
  };

  const handleUpdateGroup = async (data: GroupFormData) => {
    if (!selectedGroup?.id) return;

    try {
      await updateGroup(selectedGroup.id, {
        name: data.name,
        description: data.description,
      });
      setShowEditModal(false);
      setSelectedGroup(null);
      showToast({
        title: 'Success',
        message: 'Group updated successfully',
        variant: 'success',
      });
    } catch (error) {
      showToast({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to update group',
        variant: 'error',
      });
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    Alert.alert(
      'Delete Group',
      'Are you sure you want to delete this group? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteGroup(groupId);
              if (selectedGroup?.id === groupId) {
                setShowDetailModal(false);
                setSelectedGroup(null);
              }
              showToast({
                title: 'Success',
                message: 'Group deleted successfully',
                variant: 'success',
              });
            } catch (error) {
              showToast({
                title: 'Error',
                message: error instanceof Error ? error.message : 'Failed to delete group',
                variant: 'error',
              });
            }
          },
        },
      ]
    );
  };

  const handleViewGroup = async (group: GroupMetadata) => {
    setSelectedGroup(group);
    setShowDetailModal(true);
  };

  const handleEditGroup = (group: GroupMetadata) => {
    setSelectedGroup(group);
    setShowEditModal(true);
  };

  const renderGroupItem = ({ item }: { item: GroupMetadata }) => (
    <TouchableOpacity
      style={[styles.groupItem, { backgroundColor: colors.surface1 }]}
      onPress={() => handleViewGroup(item)}
      activeOpacity={0.7}
    >
      <View style={styles.groupInfo}>
        <Text style={[styles.groupName, { color: colors.foreground }]}>
          {item.name}
        </Text>
        {item.description && (
          <Text style={[styles.groupDescription, { color: colors.mutedForeground }]}>
            {item.description}
          </Text>
        )}
        <Text style={[styles.groupMeta, { color: colors.mutedForeground }]}>
          Members: {item.memberIds.length}
        </Text>
      </View>
      <View style={styles.groupActions}>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            handleEditGroup(item);
          }}
          style={styles.actionButton}
        >
          <IconSymbol name="pencil" size={20} color={colors.accent} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            handleDeleteGroup(item.id);
          }}
          style={styles.actionButton}
        >
          <IconSymbol name="trash.fill" size={20} color={colors.destructive} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <AppHeader title="Group Management" />
        <View style={styles.loading}>
          <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
            Loading groups...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <AdminOnly
      fallback={
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <AppHeader title="Group Management" />
          <View style={styles.unauthorized}>
            <Text style={[styles.unauthorizedText, { color: colors.foreground }]}>
              You do not have permission to access this area.
            </Text>
          </View>
        </View>
      }
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <AppHeader
          title="Group Management"
          rightActions={
            <TouchableOpacity
              onPress={() => setShowCreateModal(true)}
              style={styles.createButton}
            >
              <IconSymbol name="plus.circle.fill" size={24} color={colors.accent} />
            </TouchableOpacity>
          }
        />

        {groups.length === 0 ? (
          <View style={styles.empty}>
            <IconSymbol name="person.3.fill" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              No groups found
            </Text>
            <Button
              onPress={() => setShowCreateModal(true)}
              style={styles.createFirstButton}
            >
              Create First Group
            </Button>
          </View>
        ) : (
          <FlatList
            data={groups}
            renderItem={renderGroupItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[styles.list, { paddingBottom: bottomPadding }]}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Create Group Modal */}
        <Modal
          visible={showCreateModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowCreateModal(false)}
        >
          <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                Create New Group
              </Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <IconSymbol name="xmark.circle.fill" size={24} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>
            <GroupForm
              onSubmit={handleCreateGroup}
              onCancel={() => setShowCreateModal(false)}
              loading={createGroupHook.creating}
            />
          </View>
        </Modal>

        {/* Edit Group Modal */}
        <Modal
          visible={showEditModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowEditModal(false)}
        >
          <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                Edit Group
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowEditModal(false);
                  setSelectedGroup(null);
                }}
              >
                <IconSymbol name="xmark.circle.fill" size={24} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>
            {selectedGroup && (
              <GroupForm
                group={selectedGroup}
                onSubmit={handleUpdateGroup}
                onCancel={() => {
                  setShowEditModal(false);
                  setSelectedGroup(null);
                }}
                loading={updating}
              />
            )}
          </View>
        </Modal>

        {/* Group Detail Modal */}
        <Modal
          visible={showDetailModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowDetailModal(false)}
        >
          <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                Group Details
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowDetailModal(false);
                  setSelectedGroup(null);
                }}
              >
                <IconSymbol name="xmark.circle.fill" size={24} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>
            {selectedGroup && (
              <GroupDetail
                group={selectedGroup}
                members={groupMembers}
                onEdit={() => {
                  setShowDetailModal(false);
                  handleEditGroup(selectedGroup);
                }}
                onDelete={() => {
                  setShowDetailModal(false);
                  handleDeleteGroup(selectedGroup.id);
                }}
                onAddMember={() => {
                  // TODO: Implement add member functionality
                  showToast({
                    title: 'Info',
                    message: 'Add member functionality coming soon',
                    variant: 'info',
                  });
                }}
                onRemoveMember={(userId) => {
                  // TODO: Implement remove member functionality
                  showToast({
                    title: 'Info',
                    message: 'Remove member functionality coming soon',
                    variant: 'info',
                  });
                }}
                canEdit={true}
                canDelete={true}
                canManageMembers={true}
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
  list: {
    padding: 16,
  },
  groupItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  groupDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  groupMeta: {
    fontSize: 12,
  },
  groupActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  createButton: {
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
    marginBottom: 24,
  },
  createFirstButton: {
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

