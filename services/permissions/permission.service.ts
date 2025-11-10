/**
 * Permission Service
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Service for checking user permissions and roles
 */

import { readDocument } from '@/services/firebase/database';
import { getGlobalConfig } from '@/services/config/global-config.service';
import { isPermissionEnabled, type UserRole } from '@/utils/permissions';

export interface UserProfile {
  email: string;
  displayName: string;
  role: UserRole;
  groupId?: string;
  fileUploadCount: number;
  lastFileUploadAt?: any;
  createdAt: any;
  updatedAt: any;
}

export interface FileMetadata {
  id: string;
  name: string;
  type: 'personal' | 'app' | 'group';
  ownerId: string;
  groupId?: string;
  storagePath: string;
  mimeType: string;
  size: number;
  accessibleBy: string[];
  isPublic: boolean;
  isAppFile: boolean;
  downloadURL?: string; // Optional: cached download URL (may expire)
  createdAt: any;
  updatedAt: any;
}

export interface GroupPermissions {
  canUploadFiles?: boolean;
  canDeleteFiles?: boolean;
  canShareFiles?: boolean;
  canManageMembers?: boolean;
  canEditGroup?: boolean;
  canViewFiles?: boolean;
  maxFileSize?: number; // in bytes
  maxFileCount?: number;
  allowedFileTypes?: string[]; // MIME types or extensions
}

export interface GroupMetadata {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  memberIds: string[];
  permissions?: GroupPermissions; // Group-specific permissions
  createdAt: any;
  updatedAt: any;
}

/**
 * Check if permission system is enabled
 */
export async function isPermissionSystemEnabled(): Promise<boolean> {
  if (!isPermissionEnabled()) {
    return false;
  }
  const config = await getGlobalConfig();
  return config.enablePermissions;
}

/**
 * Get user role from Firestore
 */
export async function getUserRole(userId: string): Promise<UserRole> {
  if (!isPermissionEnabled()) {
    return 'user';
  }

  try {
    const user = await readDocument<UserProfile>(`users/${userId}`);
    return user?.role || 'user';
  } catch (error) {
    if (__DEV__) {
      console.warn(`[PermissionService] Failed to get user role for ${userId}:`, error);
    }
    return 'user';
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
      console.warn(`[PermissionService] Failed to get user profile for ${userId}:`, error);
    }
    return null;
  }
}

/**
 * Check if user can manage other users
 */
export async function canManageUsers(userId: string): Promise<boolean> {
  if (!(await isPermissionSystemEnabled())) {
    return false;
  }

  const role = await getUserRole(userId);
  return role === 'admin' || role === 'moderator';
}

/**
 * Check if user can assign role to target user
 */
export async function canAssignRole(
  userId: string,
  targetUserId: string
): Promise<boolean> {
  if (!(await isPermissionSystemEnabled())) {
    return false;
  }

  const userRole = await getUserRole(userId);
  const targetRole = await getUserRole(targetUserId);

  // Admin can assign any role
  if (userRole === 'admin') {
    return true;
  }

  // Moderator can assign editor and user roles (but not admin)
  if (userRole === 'moderator') {
    return targetRole === 'editor' || targetRole === 'user';
  }

  return false;
}

/**
 * Check if user can access file
 */
export async function canAccessFile(userId: string, fileId: string): Promise<boolean> {
  try {
    const file = await readDocument<FileMetadata>(`files/${fileId}`);
    if (!file) {
      return false;
    }

    const userRole = await getUserRole(userId);
    const userProfile = await getUserProfile(userId);

    // Admin and moderator have full access
    if (userRole === 'admin' || userRole === 'moderator') {
      return true;
    }

    // Owner has access
    if (file.ownerId === userId) {
      return true;
    }

    // Public files are accessible to all authenticated users
    if (file.isPublic) {
      return true;
    }

    // App-wide files are accessible to all authenticated users
    if (file.isAppFile) {
      return true;
    }

    // Check if user is in accessibleBy array
    if (file.accessibleBy.includes(userId)) {
      return true;
    }

    // Group files: check if user is member of the group
    if (file.type === 'group' && file.groupId && userProfile?.groupId === file.groupId) {
      return true;
    }

    return false;
  } catch (error) {
    if (__DEV__) {
      console.warn(`[PermissionService] Failed to check file access for ${fileId}:`, error);
    }
    return false;
  }
}

/**
 * Check if user can upload file (check limits)
 */
export async function canUploadFile(
  userId: string,
  fileSize: number,
  groupId?: string | null
): Promise<{
  allowed: boolean;
  reason?: string;
}> {
  const config = await getGlobalConfig();
  
  if (!config.enableFileManagement) {
    return { allowed: false, reason: 'File management is disabled' };
  }

  // Get user profile
  const userProfile = await getUserProfile(userId);
  if (!userProfile) {
    return { allowed: false, reason: 'User profile not found' };
  }

  // If uploading to a group, check group permissions
  let groupPermissions: GroupPermissions | undefined;
  if (groupId) {
    const { getGroup } = await import('@/services/groups/group.service');
    const group = await getGroup(groupId);
    
    if (!group) {
      return { allowed: false, reason: 'Group not found' };
    }

    // Check group permissions
    groupPermissions = group.permissions;
    if (groupPermissions) {
      // Check if user can upload files to this group
      if (groupPermissions.canUploadFiles === false) {
        return { allowed: false, reason: 'You do not have permission to upload files to this group' };
      }

      // Check group file size limit (group limit takes precedence)
      if (groupPermissions.maxFileSize) {
        if (fileSize > groupPermissions.maxFileSize) {
          const maxSizeMB = (groupPermissions.maxFileSize / (1024 * 1024)).toFixed(2);
          return {
            allowed: false,
            reason: `File size exceeds group maximum of ${maxSizeMB} MB`,
          };
        }
      } else {
        // No group limit, use global limit
        if (fileSize > config.maxFileSize) {
          const maxSizeMB = (config.maxFileSize / (1024 * 1024)).toFixed(2);
          return {
            allowed: false,
            reason: `File size exceeds maximum allowed size of ${maxSizeMB} MB`,
          };
        }
      }

      // Check group file count limit
      if (groupPermissions.maxFileCount) {
        const { getGroupFiles } = await import('@/services/files/file.service');
        const groupFiles = await getGroupFiles(groupId);
        if (groupFiles.length >= groupPermissions.maxFileCount) {
          return {
            allowed: false,
            reason: `Group file limit reached. Maximum ${groupPermissions.maxFileCount} files allowed in this group.`,
          };
        }
      }
    } else {
      // No group permissions, use global limits
      if (fileSize > config.maxFileSize) {
        const maxSizeMB = (config.maxFileSize / (1024 * 1024)).toFixed(2);
        return {
          allowed: false,
          reason: `File size exceeds maximum allowed size of ${maxSizeMB} MB`,
        };
      }
    }
  } else {
    // Not uploading to group, check global file size limit
    if (fileSize > config.maxFileSize) {
      const maxSizeMB = (config.maxFileSize / (1024 * 1024)).toFixed(2);
      return {
        allowed: false,
        reason: `File size exceeds maximum allowed size of ${maxSizeMB} MB`,
      };
    }

    // Check user file count limit (personal files only)
    const maxFileCount = userProfile.groupId
      ? config.maxFileCountWithGroup
      : config.maxFileCount;

    if (userProfile.fileUploadCount >= maxFileCount) {
      return {
        allowed: false,
        reason: `File upload limit reached. Maximum ${maxFileCount} files allowed.`,
      };
    }
  }

  return { allowed: true };
}

/**
 * Check if user can manage group
 */
export async function canManageGroup(userId: string, groupId: string): Promise<boolean> {
  if (!(await isPermissionSystemEnabled())) {
    return false;
  }

  try {
    const group = await readDocument<GroupMetadata>(`groups/${groupId}`);
    if (!group) {
      return false;
    }

    const userRole = await getUserRole(userId);

    // Admin and moderator can manage any group
    if (userRole === 'admin' || userRole === 'moderator') {
      return true;
    }

    // Group owner can manage their group
    if (group.ownerId === userId) {
      return true;
    }

    return false;
  } catch (error) {
    if (__DEV__) {
      console.warn(`[PermissionService] Failed to check group management for ${groupId}:`, error);
    }
    return false;
  }
}

/**
 * Get user file upload limit
 */
export async function getUserFileLimit(userId: string): Promise<number> {
  const config = await getGlobalConfig();
  const userProfile = await getUserProfile(userId);

  if (!userProfile) {
    return config.maxFileCount;
  }

  return userProfile.groupId ? config.maxFileCountWithGroup : config.maxFileCount;
}

/**
 * Get user file upload count
 */
export async function getUserFileCount(userId: string): Promise<number> {
  const userProfile = await getUserProfile(userId);
  return userProfile?.fileUploadCount || 0;
}

