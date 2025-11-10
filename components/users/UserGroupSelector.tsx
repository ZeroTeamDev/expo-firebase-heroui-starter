/**
 * User Group Selector Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Group selector for assigning users to groups
 */

import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useTheme } from 'heroui-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useGroups } from '@/hooks/use-groups';
import type { GroupMetadata } from '@/services/permissions/permission.service';

interface UserGroupSelectorProps {
  currentGroupId: string | null | undefined;
  onGroupChange: (groupId: string | null) => void;
  disabled?: boolean;
}

export function UserGroupSelector({
  currentGroupId,
  onGroupChange,
  disabled,
}: UserGroupSelectorProps) {
  const { colors, theme } = useTheme();
  const { groups, loading } = useGroups();
  const [showModal, setShowModal] = useState(false);

  // Find current group - use useMemo to ensure it updates when groups or currentGroupId changes
  const currentGroup = useMemo(() => {
    if (!currentGroupId) return null;
    return groups.find((g) => g.id === currentGroupId) || null;
  }, [groups, currentGroupId]);

  const handleGroupSelect = (groupId: string | null) => {
    onGroupChange(groupId);
    setShowModal(false);
  };

  const renderGroupItem = ({ item }: { item: GroupMetadata }) => {
    const isSelected = item.id === currentGroupId;

    return (
      <TouchableOpacity
        onPress={() => handleGroupSelect(item.id)}
        style={[
          styles.groupItem,
          {
            backgroundColor: isSelected ? colors.accent : colors.surface1,
            borderColor: isSelected ? colors.accent : colors.border,
          },
        ]}
        activeOpacity={0.7}
      >
        <View style={styles.groupItemContent}>
          <View style={styles.groupItemInfo}>
            <Text
              style={[
                styles.groupItemName,
                {
                  color: isSelected ? '#ffffff' : colors.foreground,
                  fontWeight: isSelected ? '600' : '400',
                },
              ]}
            >
              {item.name}
            </Text>
            {item.description && (
              <Text
                style={[
                  styles.groupItemDescription,
                  {
                    color: isSelected ? 'rgba(255,255,255,0.8)' : colors.mutedForeground,
                  },
                ]}
                numberOfLines={1}
              >
                {item.description}
              </Text>
            )}
            <Text
              style={[
                styles.groupItemMembers,
                {
                  color: isSelected ? 'rgba(255,255,255,0.7)' : colors.mutedForeground,
                },
              ]}
            >
              {item.memberIds.length} member{item.memberIds.length !== 1 ? 's' : ''}
            </Text>
          </View>
          {isSelected && <IconSymbol name="checkmark.circle.fill" size={20} color="#ffffff" />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => !disabled && setShowModal(true)}
        disabled={disabled || loading}
        style={[
          styles.selectorButton,
          {
            backgroundColor: colors.surface1,
            borderColor: colors.border,
          },
          (disabled || loading) && styles.selectorButtonDisabled,
        ]}
        activeOpacity={0.7}
      >
        <View style={styles.selectorButtonContent}>
          {currentGroup ? (
            <View style={styles.groupInfo}>
              <Text style={[styles.groupName, { color: colors.foreground }]}>
                {currentGroup.name}
              </Text>
              <Text style={[styles.groupMembers, { color: colors.mutedForeground }]}>
                {currentGroup.memberIds.length} members
              </Text>
            </View>
          ) : (
            <Text style={[styles.noGroupText, { color: colors.mutedForeground }]}>
              No Group
            </Text>
          )}
          <IconSymbol name="chevron.down" size={16} color={colors.mutedForeground} />
        </View>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowModal(false)}
        >
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: colors.background,
              },
            ]}
            onStartShouldSetResponder={() => true}
          >
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                Select Group
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <IconSymbol name="xmark.circle.fill" size={24} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
                  Loading groups...
                </Text>
              </View>
            ) : (
              <FlatList
                data={[
                  { id: 'no-group', name: 'No Group', description: 'Remove from group', memberIds: [] },
                  ...groups,
                ]}
                renderItem={({ item }) => {
                  const isNoGroup = item.id === 'no-group';
                  const isSelected = isNoGroup
                    ? !currentGroupId
                    : item.id === currentGroupId;

                  return (
                    <TouchableOpacity
                      onPress={() => handleGroupSelect(isNoGroup ? null : item.id)}
                      style={[
                        styles.groupItem,
                        {
                          backgroundColor: isSelected ? colors.accent : colors.surface1,
                          borderColor: isSelected ? colors.accent : colors.border,
                        },
                      ]}
                      activeOpacity={0.7}
                    >
                      <View style={styles.groupItemContent}>
                        <View style={styles.groupItemInfo}>
                          <Text
                            style={[
                              styles.groupItemName,
                              {
                                color: isSelected ? '#ffffff' : colors.foreground,
                                fontWeight: isSelected ? '600' : '400',
                              },
                            ]}
                          >
                            {item.name}
                          </Text>
                          {item.description && (
                            <Text
                              style={[
                                styles.groupItemDescription,
                                {
                                  color: isSelected
                                    ? 'rgba(255,255,255,0.8)'
                                    : colors.mutedForeground,
                                },
                              ]}
                              numberOfLines={1}
                            >
                              {item.description}
                            </Text>
                          )}
                          {!isNoGroup && (
                            <Text
                              style={[
                                styles.groupItemMembers,
                                {
                                  color: isSelected
                                    ? 'rgba(255,255,255,0.7)'
                                    : colors.mutedForeground,
                                },
                              ]}
                            >
                              {item.memberIds.length} member{item.memberIds.length !== 1 ? 's' : ''}
                            </Text>
                          )}
                        </View>
                        {isSelected && (
                          <IconSymbol name="checkmark.circle.fill" size={20} color="#ffffff" />
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                }}
                keyExtractor={(item) => item.id}
                style={styles.groupList}
                contentContainerStyle={styles.groupListContent}
              />
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  selectorButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    minHeight: 44,
  },
  selectorButtonDisabled: {
    opacity: 0.6,
  },
  selectorButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  groupMembers: {
    fontSize: 12,
  },
  noGroupText: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
  },
  groupList: {
    maxHeight: 400,
  },
  groupListContent: {
    padding: 8,
  },
  groupItem: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  groupItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  groupItemInfo: {
    flex: 1,
  },
  groupItemName: {
    fontSize: 16,
    marginBottom: 4,
  },
  groupItemDescription: {
    fontSize: 14,
    marginBottom: 2,
  },
  groupItemMembers: {
    fontSize: 12,
  },
});

