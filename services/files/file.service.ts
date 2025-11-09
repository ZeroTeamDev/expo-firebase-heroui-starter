/**
 * File Service
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Service for file metadata management in Firestore
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
import { uploadFile, deleteFileFromStorage, type UploadResult } from '@/services/storage/storage.service';
import { getGlobalConfig } from '@/services/config/global-config.service';
import { canAccessFile } from '@/services/permissions/permission.service';
import { incrementUserFileCount, decrementUserFileCount } from '@/services/users/user.service';
import type { FileMetadata } from '@/services/permissions/permission.service';

export interface CreateFileData {
  name: string;
  type: 'personal' | 'app' | 'group';
  ownerId: string;
  groupId?: string;
  storagePath: string;
  mimeType: string;
  size: number;
  accessibleBy?: string[];
  isPublic?: boolean;
  isAppFile?: boolean;
  metadata?: Record<string, any>;
}

export interface FileUploadData {
  file: File | Blob | { uri: string; name: string; type?: string; size?: number };
  name: string;
  type: 'personal' | 'app' | 'group';
  ownerId: string;
  groupId?: string;
  isPublic?: boolean;
  isAppFile?: boolean;
  metadata?: Record<string, any>;
}

/**
 * Generate storage path for file
 */
function generateStoragePath(
  type: 'personal' | 'app' | 'group',
  ownerId: string,
  fileName: string,
  groupId?: string
): string {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  switch (type) {
    case 'personal':
      return `users/${ownerId}/personal/${timestamp}_${sanitizedFileName}`;
    case 'app':
      return `app/${timestamp}_${sanitizedFileName}`;
    case 'group':
      if (!groupId) {
        throw new Error('Group ID is required for group files');
      }
      return `groups/${groupId}/${timestamp}_${sanitizedFileName}`;
    default:
      throw new Error(`Invalid file type: ${type}`);
  }
}

/**
 * Create file metadata in Firestore
 */
export async function createFileMetadata(fileData: CreateFileData): Promise<string> {
  const fileMetadata = {
    name: fileData.name,
    type: fileData.type,
    ownerId: fileData.ownerId,
    groupId: fileData.groupId,
    storagePath: fileData.storagePath,
    mimeType: fileData.mimeType,
    size: fileData.size,
    accessibleBy: fileData.accessibleBy || [],
    isPublic: fileData.isPublic || false,
    isAppFile: fileData.isAppFile || false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const fileId = await createDocumentWithId('files', fileMetadata);
  
  // Update document with the ID field
  await updateDocument(`files/${fileId}`, { id: fileId });
  
  return fileId;
}

/**
 * Upload file and create metadata
 */
export async function uploadFileWithMetadata(
  uploadData: FileUploadData,
  userId: string
): Promise<{ fileId: string; downloadURL: string }> {
  const config = await getGlobalConfig();

  // Validate file management is enabled
  if (!config.enableFileManagement) {
    throw new Error('File management is disabled');
  }

  // Generate storage path
  const storagePath = generateStoragePath(
    uploadData.type,
    uploadData.ownerId,
    uploadData.name,
    uploadData.groupId
  );

  // Upload file to storage
  const uploadResult: UploadResult = await uploadFile(uploadData.file, storagePath, {
    metadata: {
      contentType: uploadData.file instanceof File ? uploadData.file.type : uploadData.file.type || 'application/octet-stream',
    },
  });

  // Create file metadata
  const fileId = await createFileMetadata({
    name: uploadData.name,
    type: uploadData.type,
    ownerId: uploadData.ownerId,
    groupId: uploadData.groupId,
    storagePath: uploadResult.storagePath,
    mimeType: uploadResult.metadata.contentType,
    size: uploadResult.metadata.size,
    isPublic: uploadData.isPublic,
    isAppFile: uploadData.isAppFile,
    metadata: uploadData.metadata,
  });

  // Increment user file count
  await incrementUserFileCount(userId);

  return {
    fileId,
    downloadURL: uploadResult.downloadURL,
  };
}

/**
 * Update file metadata
 */
export async function updateFileMetadata(
  fileId: string,
  updates: Partial<CreateFileData>
): Promise<void> {
  await updateDocument(`files/${fileId}`, {
    ...updates,
    updatedAt: new Date(),
  });
}

/**
 * Get file metadata
 */
export async function getFileMetadata(fileId: string): Promise<FileMetadata | null> {
  try {
    const file = await readDocument<FileMetadata>(`files/${fileId}`);
    if (file) {
      // Ensure ID is set
      file.id = fileId;
    }
    return file;
  } catch (error) {
    if (__DEV__) {
      console.warn(`[FileService] Failed to get file metadata for ${fileId}:`, error);
    }
    return null;
  }
}

/**
 * Delete file and metadata
 */
export async function deleteFile(fileId: string, userId: string): Promise<void> {
  const file = await getFileMetadata(fileId);
  if (!file) {
    throw new Error('File not found');
  }

  // Check if user can delete file (must be owner or have admin/moderator access)
  const isOwner = file.ownerId === userId;
  const hasAccess = await canAccessFile(userId, fileId);
  
  // Only owner can delete, or admin/moderator (checked via canAccessFile)
  if (!isOwner && !hasAccess) {
    // Double check if user is admin/moderator by checking role
    const { getUserRole } = await import('@/services/permissions/permission.service');
    const userRole = await getUserRole(userId);
    if (userRole !== 'admin' && userRole !== 'moderator') {
      throw new Error('You do not have permission to delete this file');
    }
  }

  // Delete from storage
  await deleteFileFromStorage(file.storagePath);

  // Delete metadata
  await deleteDocument(`files/${fileId}`);

  // Decrement user file count
  await decrementUserFileCount(file.ownerId);
}

/**
 * Share file with user
 */
export async function shareFile(fileId: string, userId: string, targetUserId: string): Promise<void> {
  const file = await getFileMetadata(fileId);
  if (!file) {
    throw new Error('File not found');
  }

  // Check if user can share file (owner)
  if (file.ownerId !== userId) {
    throw new Error('Only the file owner can share the file');
  }

  // Add user to accessibleBy array
  const accessibleBy = file.accessibleBy || [];
  if (!accessibleBy.includes(targetUserId)) {
    await updateFileMetadata(fileId, {
      accessibleBy: [...accessibleBy, targetUserId],
    });
  }
}

/**
 * Unshare file with user
 */
export async function unshareFile(fileId: string, userId: string, targetUserId: string): Promise<void> {
  const file = await getFileMetadata(fileId);
  if (!file) {
    throw new Error('File not found');
  }

  // Check if user can unshare file (owner)
  if (file.ownerId !== userId) {
    throw new Error('Only the file owner can unshare the file');
  }

  // Remove user from accessibleBy array
  const accessibleBy = (file.accessibleBy || []).filter((id) => id !== targetUserId);
  await updateFileMetadata(fileId, {
    accessibleBy,
  });
}

/**
 * Check if user can access file
 */
export async function checkFileAccess(userId: string, fileId: string): Promise<boolean> {
  return await canAccessFile(userId, fileId);
}

/**
 * Get user's files
 */
export async function getUserFiles(userId: string, filters?: QueryFilters): Promise<FileMetadata[]> {
  const baseFilters: QueryFilters = {
    where: [['ownerId', '==', userId]],
    ...filters,
  };

  const files = await readCollection<FileMetadata>('files', baseFilters);
  return files;
}

/**
 * Get group files
 */
export async function getGroupFiles(groupId: string): Promise<FileMetadata[]> {
  const filters: QueryFilters = {
    where: [['groupId', '==', groupId], ['type', '==', 'group']],
  };

  return await readCollection<FileMetadata>('files', filters);
}

/**
 * Get app-wide files
 */
export async function getAppFiles(): Promise<FileMetadata[]> {
  const filters: QueryFilters = {
    where: [['isAppFile', '==', true]],
  };

  return await readCollection<FileMetadata>('files', filters);
}

/**
 * List files with filters and permissions
 */
export async function listFiles(
  userId: string,
  filters?: QueryFilters
): Promise<FileMetadata[]> {
  // Get all files - access control is handled by Firestore security rules
  // and checked individually when accessing files
  const allFiles = await readCollection<FileMetadata>('files', filters);
  
  // Return files with IDs - Firestore rules will handle access control
  return allFiles.filter((file): file is FileMetadata => file.id !== undefined);
}

