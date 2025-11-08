/**
 * User Service
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Service for user management operations
 */

import {
  readDocument,
  createDocument,
  updateDocument,
  readCollection,
  type QueryFilters,
} from '@/services/firebase/database';
import { getUserRole, canAssignRole, type UserRole } from '@/services/permissions/permission.service';
import type { UserProfile } from '@/services/permissions/permission.service';

export interface CreateUserData {
  email: string;
  displayName: string;
  role?: UserRole;
  groupId?: string;
}

export interface UpdateUserData {
  displayName?: string;
  role?: UserRole;
  groupId?: string;
}

export interface UserStats {
  fileUploadCount: number;
  lastFileUploadAt?: any;
}

/**
 * Create user profile in Firestore
 */
export async function createUser(
  userId: string,
  userData: CreateUserData
): Promise<void> {
  const isPermissionsEnabled = process.env.EXPO_PUBLIC_ENABLE_PERMISSIONS === 'true';
  
  const userProfile: UserProfile = {
    email: userData.email,
    displayName: userData.displayName,
    role: isPermissionsEnabled ? (userData.role || 'user') : 'user',
    groupId: userData.groupId,
    fileUploadCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await createDocument(`users/${userId}`, userProfile);
}

/**
 * Update user role (admin only)
 */
export async function updateUserRole(
  userId: string,
  newRole: UserRole,
  updatedBy: string
): Promise<void> {
  // Check if updater can assign this role
  const canAssign = await canAssignRole(updatedBy, userId);
  if (!canAssign) {
    throw new Error('You do not have permission to assign this role');
  }

  await updateDocument(`users/${userId}`, {
    role: newRole,
    updatedAt: new Date(),
  });
}

/**
 * Assign user to group (enforce 1 group per user)
 */
export async function assignUserToGroup(
  userId: string,
  groupId: string,
  updatedBy: string
): Promise<void> {
  const userProfile = await getUserProfile(userId);
  if (!userProfile) {
    throw new Error('User not found');
  }

  // If user is already in a group, remove from previous group first
  if (userProfile.groupId && userProfile.groupId !== groupId) {
    await removeUserFromGroup(userId, updatedBy);
  }

  // Add user to new group
  await updateDocument(`users/${userId}`, {
    groupId,
    updatedAt: new Date(),
  });

  // Update group member list (this should be done in group service, but for now we do it here)
  const group = await readDocument<any>(`groups/${groupId}`);
  if (group) {
    const memberIds = group.memberIds || [];
    if (!memberIds.includes(userId)) {
      await updateDocument(`groups/${groupId}`, {
        memberIds: [...memberIds, userId],
        updatedAt: new Date(),
      });
    }
  }
}

/**
 * Remove user from group
 */
export async function removeUserFromGroup(
  userId: string,
  updatedBy: string
): Promise<void> {
  const userProfile = await getUserProfile(userId);
  if (!userProfile || !userProfile.groupId) {
    return;
  }

  const groupId = userProfile.groupId;

  // Remove user from group
  await updateDocument(`users/${userId}`, {
    groupId: null,
    updatedAt: new Date(),
  });

  // Remove user from group member list
  const group = await readDocument<any>(`groups/${groupId}`);
  if (group && group.memberIds) {
    const memberIds = group.memberIds.filter((id: string) => id !== userId);
    await updateDocument(`groups/${groupId}`, {
      memberIds,
      updatedAt: new Date(),
    });
  }
}

/**
 * Get user profile
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const user = await readDocument<UserProfile>(`users/${userId}`);
    return user;
  } catch (error) {
    if (__DEV__) {
      console.warn(`[UserService] Failed to get user profile for ${userId}:`, error);
    }
    return null;
  }
}

/**
 * List users with filters (admin/moderator only)
 */
export async function listUsers(filters?: QueryFilters): Promise<UserProfile[]> {
  try {
    const users = await readCollection<UserProfile>('users', filters);
    return users;
  } catch (error) {
    if (__DEV__) {
      console.warn('[UserService] Failed to list users:', error);
    }
    return [];
  }
}

/**
 * Get user file statistics
 */
export async function getUserFileStats(userId: string): Promise<UserStats> {
  const userProfile = await getUserProfile(userId);
  if (!userProfile) {
    return {
      fileUploadCount: 0,
    };
  }

  return {
    fileUploadCount: userProfile.fileUploadCount,
    lastFileUploadAt: userProfile.lastFileUploadAt,
  };
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: UpdateUserData
): Promise<void> {
  await updateDocument(`users/${userId}`, {
    ...updates,
    updatedAt: new Date(),
  });
}

/**
 * Increment user file upload count
 */
export async function incrementUserFileCount(userId: string): Promise<void> {
  const userProfile = await getUserProfile(userId);
  if (!userProfile) {
    return;
  }

  await updateDocument(`users/${userId}`, {
    fileUploadCount: (userProfile.fileUploadCount || 0) + 1,
    lastFileUploadAt: new Date(),
    updatedAt: new Date(),
  });
}

/**
 * Decrement user file upload count
 */
export async function decrementUserFileCount(userId: string): Promise<void> {
  const userProfile = await getUserProfile(userId);
  if (!userProfile) {
    return;
  }

  const newCount = Math.max(0, (userProfile.fileUploadCount || 0) - 1);
  await updateDocument(`users/${userId}`, {
    fileUploadCount: newCount,
    updatedAt: new Date(),
  });
}

