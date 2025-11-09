/**
 * Group Detail Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Display group details and manage members
 */

import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from 'heroui-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { GroupMetadata, GroupPermissions } from '@/services/permissions/permission.service';
import type { UserProfile } from '@/services/permissions/permission.service';

interface GroupDetailProps {
  group: GroupMetadata;
  members: (UserProfile & { id: string })[];
  onEdit: () => void;
  onDelete: () => void;
  onAddMember: () => void;
  onRemoveMember: (userId: string) => void;
  canEdit: boolean;
  canDelete: boolean;
  canManageMembers: boolean;
}

export function GroupDetail({
  group,
  members,
  onEdit,
  onDelete,
  onAddMember,
  onRemoveMember,
  canEdit,
  canDelete,
  canManageMembers,
}: GroupDetailProps) {
  const { colors } = useTheme();

  const renderMemberItem = ({ item }: { item: UserProfile & { id: string } }) => (
    <View style={[styles.memberItem, { backgroundColor: colors.surface1 }]}>
      <View style={styles.memberInfo}>
        <Text style={[styles.memberName, { color: colors.foreground }]}>
          {item.displayName}
        </Text>
        <Text style={[styles.memberEmail, { color: colors.mutedForeground }]}>
          {item.email}
        </Text>
        <Text style={[styles.memberRole, { color: colors.mutedForeground }]}>
          Role: {item.role}
        </Text>
      </View>
      {canManageMembers && (
        <TouchableOpacity
          onPress={() => onRemoveMember(item.id)}
          style={styles.removeButton}
        >
          <IconSymbol name="person.crop.circle.badge.minus" size={20} color={colors.destructive} />
        </TouchableOpacity>
      )}
    </View>
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const permissions: GroupPermissions = group.permissions || {
    canUploadFiles: true,
    canDeleteFiles: true,
    canShareFiles: true,
    canManageMembers: false,
    canEditGroup: false,
    canViewFiles: true,
    maxFileSize: 10 * 1024 * 1024,
    maxFileCount: 100,
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { backgroundColor: colors.surface1 }]}>
        <View style={styles.headerContent}>
          <Text style={[styles.groupName, { color: colors.foreground }]}>{group.name}</Text>
          {group.description && (
            <Text style={[styles.groupDescription, { color: colors.mutedForeground }]}>
              {group.description}
            </Text>
          )}
          <Text style={[styles.memberCount, { color: colors.mutedForeground }]}>
            {members.length} member{members.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <View style={styles.headerActions}>
          {canEdit && (
            <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
              <IconSymbol name="pencil" size={20} color={colors.accent} />
            </TouchableOpacity>
          )}
          {canDelete && (
            <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
              <IconSymbol name="trash.fill" size={20} color={colors.destructive} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Permissions Section */}
      <View style={styles.permissionsSection}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Group Permissions</Text>
        <View style={[styles.permissionsCard, { backgroundColor: colors.surface1, borderColor: colors.border }]}>
          <View style={styles.permissionRow}>
            <Text style={[styles.permissionLabel, { color: colors.foreground }]}>View Files</Text>
            <IconSymbol
              name={permissions.canViewFiles ? 'checkmark.circle.fill' : 'xmark.circle.fill'}
              size={20}
              color={permissions.canViewFiles ? colors.accent : colors.mutedForeground}
            />
          </View>
          <View style={styles.permissionRow}>
            <Text style={[styles.permissionLabel, { color: colors.foreground }]}>Upload Files</Text>
            <IconSymbol
              name={permissions.canUploadFiles ? 'checkmark.circle.fill' : 'xmark.circle.fill'}
              size={20}
              color={permissions.canUploadFiles ? colors.accent : colors.mutedForeground}
            />
          </View>
          <View style={styles.permissionRow}>
            <Text style={[styles.permissionLabel, { color: colors.foreground }]}>Delete Files</Text>
            <IconSymbol
              name={permissions.canDeleteFiles ? 'checkmark.circle.fill' : 'xmark.circle.fill'}
              size={20}
              color={permissions.canDeleteFiles ? colors.accent : colors.mutedForeground}
            />
          </View>
          <View style={styles.permissionRow}>
            <Text style={[styles.permissionLabel, { color: colors.foreground }]}>Share Files</Text>
            <IconSymbol
              name={permissions.canShareFiles ? 'checkmark.circle.fill' : 'xmark.circle.fill'}
              size={20}
              color={permissions.canShareFiles ? colors.accent : colors.mutedForeground}
            />
          </View>
          <View style={styles.permissionRow}>
            <Text style={[styles.permissionLabel, { color: colors.foreground }]}>Manage Members</Text>
            <IconSymbol
              name={permissions.canManageMembers ? 'checkmark.circle.fill' : 'xmark.circle.fill'}
              size={20}
              color={permissions.canManageMembers ? colors.accent : colors.mutedForeground}
            />
          </View>
          <View style={styles.permissionRow}>
            <Text style={[styles.permissionLabel, { color: colors.foreground }]}>Edit Group</Text>
            <IconSymbol
              name={permissions.canEditGroup ? 'checkmark.circle.fill' : 'xmark.circle.fill'}
              size={20}
              color={permissions.canEditGroup ? colors.accent : colors.mutedForeground}
            />
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.limitRow}>
            <Text style={[styles.limitLabel, { color: colors.foreground }]}>Max File Size</Text>
            <Text style={[styles.limitValue, { color: colors.accent }]}>
              {formatFileSize(permissions.maxFileSize || 10 * 1024 * 1024)}
            </Text>
          </View>
          <View style={styles.limitRow}>
            <Text style={[styles.limitLabel, { color: colors.foreground }]}>Max File Count</Text>
            <Text style={[styles.limitValue, { color: colors.accent }]}>
              {permissions.maxFileCount || 100}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.membersSection}>
        <View style={styles.membersHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Members</Text>
          {canManageMembers && (
            <TouchableOpacity onPress={onAddMember} style={styles.addButton}>
              <IconSymbol name="person.crop.circle.badge.plus" size={20} color={colors.accent} />
              <Text style={[styles.addButtonText, { color: colors.accent }]}>Add Member</Text>
            </TouchableOpacity>
          )}
        </View>

        {members.length === 0 ? (
          <View style={styles.emptyMembers}>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              No members in this group
            </Text>
          </View>
        ) : (
          <FlatList
            data={members}
            renderItem={renderMemberItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderRadius: 12,
    margin: 16,
  },
  headerContent: {
    flex: 1,
  },
  groupName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  groupDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  memberCount: {
    fontSize: 12,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  actionButton: {
    padding: 8,
  },
  membersSection: {
    flex: 1,
    paddingHorizontal: 16,
  },
  membersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  permissionsSection: {
    padding: 16,
    marginTop: 8,
  },
  permissionsCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  permissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  permissionLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  limitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  limitLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  limitValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  memberEmail: {
    fontSize: 14,
    marginBottom: 2,
  },
  memberRole: {
    fontSize: 12,
  },
  removeButton: {
    padding: 8,
  },
  emptyMembers: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
});

