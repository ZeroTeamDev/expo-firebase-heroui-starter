/**
 * Permission Utilities
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Utility functions for checking permissions
 */

export type UserRole = 'admin' | 'moderator' | 'editor' | 'user';

/**
 * Check if permission system is enabled
 */
export function isPermissionEnabled(): boolean {
  return process.env.EXPO_PUBLIC_ENABLE_PERMISSIONS === 'true';
}

/**
 * Check if groups are enabled
 */
export function isGroupsEnabled(): boolean {
  return process.env.EXPO_PUBLIC_ENABLE_GROUPS === 'true';
}

/**
 * Get role hierarchy level
 */
export function getRoleLevel(role: UserRole): number {
  switch (role) {
    case 'admin':
      return 4;
    case 'moderator':
      return 3;
    case 'editor':
      return 2;
    case 'user':
      return 1;
    default:
      return 0;
  }
}

/**
 * Check if role has permission to manage another role
 */
export function canManageRole(userRole: UserRole, targetRole: UserRole): boolean {
  if (!isPermissionEnabled()) {
    return false;
  }

  // Admin can manage all roles
  if (userRole === 'admin') {
    return true;
  }

  // Moderator can manage editor and user
  if (userRole === 'moderator') {
    return targetRole === 'editor' || targetRole === 'user';
  }

  // Editor and user cannot manage other roles
  return false;
}

/**
 * Check if user can assign role
 */
export function canAssignRole(userRole: UserRole, targetRole: UserRole): boolean {
  return canManageRole(userRole, targetRole);
}

