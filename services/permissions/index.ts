/**
 * Permission Services Export
 * Created by Kien AI (leejungkiin@gmail.com)
 */

export {
  isPermissionSystemEnabled,
  getUserRole,
  getUserProfile,
  canManageUsers,
  canAssignRole,
  canAccessFile,
  canUploadFile,
  canManageGroup,
  getUserFileLimit,
  getUserFileCount,
  type UserProfile,
  type UserRole,
  type FileMetadata,
  type GroupMetadata,
} from './permission.service';

