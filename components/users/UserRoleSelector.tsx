/**
 * User Role Selector Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Role selector with permission checks
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useTheme } from 'heroui-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { UserRole } from '@/utils/permissions';
import { canAssignRole } from '@/utils/permissions';
import { useUserRole } from '@/hooks/use-permissions';

interface UserRoleSelectorProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  disabled?: boolean;
}

const roles: UserRole[] = ['admin', 'moderator', 'editor', 'user'];

export function UserRoleSelector({ currentRole, onRoleChange, disabled }: UserRoleSelectorProps) {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';
  const currentUserRole = useUserRole();
  const [showModal, setShowModal] = useState(false);

  // Filter roles that current user can assign
  const assignableRoles = roles.filter((role) => {
    if (!currentUserRole) return false;
    return canAssignRole(currentUserRole, role);
  });

  const handleRoleSelect = (role: UserRole) => {
    onRoleChange(role);
    setShowModal(false);
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

  const renderRoleItem = ({ item }: { item: UserRole }) => {
    const isSelected = item === currentRole;
    const isDisabled = disabled || !assignableRoles.includes(item);

    return (
      <TouchableOpacity
        onPress={() => !isDisabled && handleRoleSelect(item)}
        disabled={isDisabled}
        style={[
          styles.roleItem,
          {
            backgroundColor: isSelected
              ? getRoleColor(item)
              : isDisabled
              ? colors.surface2
              : colors.surface1,
            borderColor: isSelected ? getRoleColor(item) : colors.border,
          },
          isDisabled && styles.roleItemDisabled,
        ]}
        activeOpacity={0.7}
      >
        <View style={styles.roleItemContent}>
          <Text
            style={[
              styles.roleItemText,
              {
                color: isSelected
                  ? '#ffffff'
                  : isDisabled
                  ? colors.mutedForeground
                  : colors.foreground,
                fontWeight: isSelected ? '600' : '400',
              },
            ]}
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </Text>
          {isSelected && (
            <IconSymbol name="checkmark.circle.fill" size={20} color="#ffffff" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => !disabled && setShowModal(true)}
        disabled={disabled}
        style={[
          styles.selectorButton,
          {
            backgroundColor: colors.surface1,
            borderColor: colors.border,
          },
          disabled && styles.selectorButtonDisabled,
        ]}
        activeOpacity={0.7}
      >
        <View style={styles.selectorButtonContent}>
          <View
            style={[
              styles.roleBadge,
              {
                backgroundColor: getRoleColor(currentRole),
              },
            ]}
          >
            <Text style={styles.roleBadgeText}>
              {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}
            </Text>
          </View>
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
                Select Role
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <IconSymbol name="xmark.circle.fill" size={24} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={roles}
              renderItem={renderRoleItem}
              keyExtractor={(item) => item}
              style={styles.roleList}
              contentContainerStyle={styles.roleListContent}
            />
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
  roleList: {
    maxHeight: 300,
  },
  roleListContent: {
    padding: 8,
  },
  roleItem: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  roleItemDisabled: {
    opacity: 0.5,
  },
  roleItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roleItemText: {
    fontSize: 16,
  },
});

