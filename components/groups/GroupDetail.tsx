/**
 * Group Detail Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Display group details and manage members
 */

import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from 'heroui-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { GroupMetadata } from '@/services/permissions/permission.service';
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

  return (
    <View style={styles.container}>
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
          />
        )}
      </View>
    </View>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
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

