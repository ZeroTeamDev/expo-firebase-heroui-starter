/**
 * Group Service
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Service for group management operations
 */

import {
  readDocument,
  createDocument,
  createDocumentWithId,
  updateDocument,
  deleteDocument,
  readCollection,
  type QueryFilters,
} from '@/services/firebase/database';
import {
  canManageGroup,
  getUserRole,
  type GroupMetadata,
  type UserRole,
} from '@/services/permissions/permission.service';
import { getUserProfile, removeUserFromGroup as removeUserFromGroupService } from '@/services/users/user.service';
import { isPermissionSystemEnabled } from '@/services/permissions/permission.service';

export interface CreateGroupData {
  name: string;
  description?: string;
  ownerId: string;
  memberIds?: string[];
  permissions?: {
    canUploadFiles?: boolean;
    canDeleteFiles?: boolean;
    canShareFiles?: boolean;
    canManageMembers?: boolean;
    canEditGroup?: boolean;
    canViewFiles?: boolean;
    maxFileSize?: number; // in bytes
    maxFileCount?: number;
    allowedFileTypes?: string[]; // MIME types or extensions
  };
  settings?: {
    maxFileSize?: number;
    maxFileCount?: number;
  };
}

export interface UpdateGroupData {
  name?: string;
  description?: string;
  memberIds?: string[];
  permissions?: {
    canUploadFiles?: boolean;
    canDeleteFiles?: boolean;
    canShareFiles?: boolean;
    canManageMembers?: boolean;
    canEditGroup?: boolean;
    canViewFiles?: boolean;
    maxFileSize?: number; // in bytes
    maxFileCount?: number;
    allowedFileTypes?: string[]; // MIME types or extensions
  };
  settings?: {
    maxFileSize?: number;
    maxFileCount?: number;
  };
}

/**
 * Create group (admin/moderator only)
 */
export async function createGroup(
  groupData: CreateGroupData,
  createdBy: string
): Promise<string> {
  // Check if permissions are enabled
  if (!(await isPermissionSystemEnabled())) {
    throw new Error('Groups are only available when permissions are enabled');
  }

  // Check if user can create groups
  const userRole = await getUserRole(createdBy);
  if (userRole !== 'admin' && userRole !== 'moderator') {
    throw new Error('Only admins and moderators can create groups');
  }

  // Default permissions for new groups
  const defaultPermissions = {
    canUploadFiles: true,
    canDeleteFiles: true,
    canShareFiles: true,
    canManageMembers: false, // Only owner/admin can manage by default
    canEditGroup: false, // Only owner/admin can edit by default
    canViewFiles: true,
    maxFileSize: groupData.settings?.maxFileSize || 10 * 1024 * 1024, // 10MB default
    maxFileCount: groupData.settings?.maxFileCount || 100, // 100 files default
    allowedFileTypes: [],
  };

  const group: Omit<GroupMetadata, 'id'> = {
    name: groupData.name,
    description: groupData.description,
    ownerId: groupData.ownerId,
    memberIds: groupData.memberIds || [],
    permissions: groupData.permissions || defaultPermissions,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const groupId = await createDocumentWithId('groups', group);
  
  // Update document with ID
  await updateDocument(`groups/${groupId}`, { id: groupId });

  return groupId;
}

/**
 * Update group (admin/moderator/owner)
 */
export async function updateGroup(
  groupId: string,
  updates: UpdateGroupData,
  updatedBy: string
): Promise<void> {
  // Check if user can manage group
  const canManage = await canManageGroup(updatedBy, groupId);
  if (!canManage) {
    throw new Error('You do not have permission to update this group');
  }

  await updateDocument(`groups/${groupId}`, {
    ...updates,
    updatedAt: new Date(),
  });
}

/**
 * Delete group (admin/owner)
 */
export async function deleteGroup(groupId: string, deletedBy: string): Promise<void> {
  const group = await getGroup(groupId);
  if (!group) {
    throw new Error('Group not found');
  }

  const userRole = await getUserRole(deletedBy);
  const isOwner = group.ownerId === deletedBy;

  if (userRole !== 'admin' && !isOwner) {
    throw new Error('Only group owner or admin can delete the group');
  }

  // Remove all members from the group before deleting
  for (const memberId of group.memberIds) {
    await removeUserFromGroupService(memberId, deletedBy);
  }

  // Delete group
  await deleteDocument(`groups/${groupId}`);
}

/**
 * Add member to group (enforce 1 group per user)
 */
export async function addGroupMember(
  groupId: string,
  userId: string,
  addedBy: string
): Promise<void> {
  // Check if user can manage group
  const canManage = await canManageGroup(addedBy, groupId);
  if (!canManage) {
    throw new Error('You do not have permission to add members to this group');
  }

  // Get user's current group
  const userProfile = await getUserProfile(userId);
  if (!userProfile) {
    throw new Error('User not found');
  }

  // If user is already in a group, remove from previous group first
  if (userProfile.groupId && userProfile.groupId !== groupId) {
    await removeUserFromGroupService(userId, addedBy);
  }

  // Get group
  const group = await getGroup(groupId);
  if (!group) {
    throw new Error('Group not found');
  }

  // Add user to group member list if not already a member
  if (!group.memberIds.includes(userId)) {
    await updateDocument(`groups/${groupId}`, {
      memberIds: [...group.memberIds, userId],
      updatedAt: new Date(),
    });
  }

  // Update user's group assignment
  const { assignUserToGroup } = await import('@/services/users/user.service');
  await assignUserToGroup(userId, groupId, addedBy);
}

/**
 * Remove member from group
 */
export async function removeGroupMember(
  groupId: string,
  userId: string,
  removedBy: string
): Promise<void> {
  // Check if user can manage group
  const canManage = await canManageGroup(removedBy, groupId);
  if (!canManage) {
    throw new Error('You do not have permission to remove members from this group');
  }

  // Get group
  const group = await getGroup(groupId);
  if (!group) {
    throw new Error('Group not found');
  }

  // Remove user from group member list
  const memberIds = group.memberIds.filter((id) => id !== userId);
  await updateDocument(`groups/${groupId}`, {
    memberIds,
    updatedAt: new Date(),
  });

  // Remove user from group (this will update user's groupId)
  await removeUserFromGroupService(userId, removedBy);
}

/**
 * Get group details
 */
export async function getGroup(groupId: string): Promise<GroupMetadata | null> {
  try {
    const group = await readDocument<GroupMetadata>(`groups/${groupId}`);
    if (group) {
      group.id = groupId;
    }
    return group;
  } catch (error) {
    if (__DEV__) {
      console.warn(`[GroupService] Failed to get group for ${groupId}:`, error);
    }
    return null;
  }
}

/**
 * Get user's group (1 group max)
 */
export async function getUserGroup(userId: string): Promise<GroupMetadata | null> {
  const userProfile = await getUserProfile(userId);
  if (!userProfile || !userProfile.groupId) {
    return null;
  }

  return await getGroup(userProfile.groupId);
}

/**
 * List groups (admin/moderator)
 */
export async function listGroups(
  userId: string,
  filters?: QueryFilters
): Promise<GroupMetadata[]> {
  // Check if user can list groups
  const userRole = await getUserRole(userId);
  if (userRole !== 'admin' && userRole !== 'moderator') {
    throw new Error('Only admins and moderators can list all groups');
  }

  return await readCollection<GroupMetadata>('groups', filters);
}

/**
 * Validate user can be assigned to group
 */
export async function validateGroupAssignment(
  userId: string,
  groupId: string
): Promise<{
  valid: boolean;
  error?: string;
}> {
  // Check if permissions are enabled
  if (!(await isPermissionSystemEnabled())) {
    return {
      valid: false,
      error: 'Groups are only available when permissions are enabled',
    };
  }

  // Check if group exists
  const group = await getGroup(groupId);
  if (!group) {
    return {
      valid: false,
      error: 'Group not found',
    };
  }

  // Check if user is already in this group
  if (group.memberIds.includes(userId)) {
    return {
      valid: false,
      error: 'User is already a member of this group',
    };
  }

  // Check if user is in another group
  const userProfile = await getUserProfile(userId);
  if (userProfile?.groupId && userProfile.groupId !== groupId) {
    return {
      valid: true, // Valid, but will require removing from previous group
      error: 'User is already in another group. They will be moved to this group.',
    };
  }

  return { valid: true };
}

