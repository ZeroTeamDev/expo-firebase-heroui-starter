/**
 * File Hooks
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * React hooks for file operations
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import {
  uploadFileWithMetadata,
  getFileMetadata,
  deleteFile as deleteFileService,
  shareFile as shareFileService,
  unshareFile as unshareFileService,
  getUserFiles,
  getGroupFiles,
  getAppFiles,
  listFiles,
  checkFileAccess,
  type FileUploadData,
} from '@/services/files/file.service';
import {
  subscribeToCollection,
} from '@/services/firebase/database';
import type { QueryFilters } from '@/services/firebase/database';
import type { FileMetadata } from '@/services/permissions/permission.service';

/**
 * Get files with real-time updates
 */
export function useFiles(filters?: QueryFilters) {
  const user = useAuthStore((state) => state.user);
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setFiles([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToCollection<FileMetadata>(
      'files',
      (fileList, err) => {
        if (err) {
          setError(err);
          setLoading(false);
          return;
        }

        // Filter files based on access permissions
        // Note: This is a simplified version. In production, you might want to
        // filter on the server side or use more efficient methods
        Promise.all(
          fileList.map(async (file) => {
            const canAccess = await checkFileAccess(user.uid, file.id);
            return canAccess ? file : null;
          })
        )
          .then((accessibleFiles) => {
            setFiles(accessibleFiles.filter((f): f is FileMetadata => f !== null));
            setLoading(false);
          })
          .catch((err) => {
            setError(err);
            setLoading(false);
          });
      },
      filters
    );

    return () => unsubscribe();
  }, [user?.uid, JSON.stringify(filters)]);

  return { files, loading, error };
}

/**
 * Get all files (admin mode - no permission filtering)
 */
export function useAllFiles(filters?: QueryFilters) {
  const user = useAuthStore((state) => state.user);
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setFiles([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Admin mode: get all files without permission filtering
    const unsubscribe = subscribeToCollection<FileMetadata>(
      'files',
      (fileList, err) => {
        if (err) {
          setError(err);
          setLoading(false);
          return;
        }

        // Ensure all files have IDs
        const filesWithIds = fileList.map((file) => ({
          ...file,
          id: (file as any).id || '',
        }));

        setFiles(filesWithIds);
        setLoading(false);
      },
      filters
    );

    return () => unsubscribe();
  }, [user?.uid, JSON.stringify(filters)]);

  return { files, loading, error };
}

/**
 * Get single file
 */
export function useFile(fileId: string | null) {
  const [file, setFile] = useState<FileMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!fileId) {
      setFile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    getFileMetadata(fileId)
      .then((fileData) => {
        setFile(fileData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [fileId]);

  return { file, loading, error };
}

/**
 * Upload file hook
 */
export function useUploadFile() {
  const user = useAuthStore((state) => state.user);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<{ fileId: string; downloadURL: string } | null>(null);

  const upload = useCallback(
    async (uploadData: FileUploadData) => {
      if (!user?.uid) {
        throw new Error('User not authenticated');
      }

      setUploading(true);
      setProgress(0);
      setError(null);
      setResult(null);

      try {
        // Set owner ID if not provided
        const dataWithOwner: FileUploadData = {
          ...uploadData,
          ownerId: uploadData.ownerId || user.uid,
        };

        const uploadResult = await uploadFileWithMetadata(dataWithOwner, user.uid);
        setResult(uploadResult);
        setProgress(100);
        return uploadResult;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setUploading(false);
      }
    },
    [user?.uid]
  );

  return { upload, uploading, progress, error, result };
}

/**
 * Delete file hook
 */
export function useDeleteFile() {
  const user = useAuthStore((state) => state.user);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteFile = useCallback(
    async (fileId: string) => {
      if (!user?.uid) {
        throw new Error('User not authenticated');
      }

      setDeleting(true);
      setError(null);

      try {
        await deleteFileService(fileId, user.uid);
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setDeleting(false);
      }
    },
    [user?.uid]
  );

  return { deleteFile, deleting, error };
}

/**
 * Check file access
 */
export function useFileAccess(fileId: string | null) {
  const user = useAuthStore((state) => state.user);
  const [canAccess, setCanAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid || !fileId) {
      setCanAccess(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    checkFileAccess(user.uid, fileId)
      .then((access) => {
        setCanAccess(access);
        setLoading(false);
      })
      .catch(() => {
        setCanAccess(false);
        setLoading(false);
      });
  }, [user?.uid, fileId]);

  return { canAccess, loading };
}

/**
 * Get user's files with real-time updates
 */
export function useUserFiles(userId?: string) {
  const currentUser = useAuthStore((state) => state.user);
  const targetUserId = userId || currentUser?.uid;
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!targetUserId) {
      setFiles([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Use real-time subscription instead of one-time fetch
    const unsubscribe = subscribeToCollection<FileMetadata>(
      'files',
      (fileList, err) => {
        if (err) {
          setError(err);
          setLoading(false);
          return;
        }

        // Filter files by ownerId
        const userFiles = fileList.filter((file) => file.ownerId === targetUserId);
        
        // Ensure all files have IDs
        const filesWithIds = userFiles.map((file) => ({
          ...file,
          id: (file as any).id || '',
        }));

        setFiles(filesWithIds);
        setLoading(false);
      },
      {
        where: [['ownerId', '==', targetUserId]],
      }
    );

    return () => unsubscribe();
  }, [targetUserId]);

  return { files, loading, error };
}

/**
 * Get group files with real-time updates
 */
export function useGroupFiles(groupId: string | null) {
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!groupId) {
      setFiles([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Use real-time subscription instead of one-time fetch
    const unsubscribe = subscribeToCollection<FileMetadata>(
      'files',
      (fileList, err) => {
        if (err) {
          setError(err);
          setLoading(false);
          return;
        }

        // Filter files by groupId
        const groupFiles = fileList.filter((file) => file.groupId === groupId);
        
        // Ensure all files have IDs
        const filesWithIds = groupFiles.map((file) => ({
          ...file,
          id: (file as any).id || '',
        }));

        setFiles(filesWithIds);
        setLoading(false);
      },
      {
        where: [['groupId', '==', groupId]],
      }
    );

    return () => unsubscribe();
  }, [groupId]);

  return { files, loading, error };
}

/**
 * Get app-wide files with real-time updates
 */
export function useAppFiles() {
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Use real-time subscription instead of one-time fetch
    const unsubscribe = subscribeToCollection<FileMetadata>(
      'files',
      (fileList, err) => {
        if (err) {
          setError(err);
          setLoading(false);
          return;
        }

        // Filter files by type === 'app'
        const appFiles = fileList.filter((file) => file.type === 'app');
        
        // Ensure all files have IDs
        const filesWithIds = appFiles.map((file) => ({
          ...file,
          id: (file as any).id || '',
        }));

        setFiles(filesWithIds);
        setLoading(false);
      },
      {
        where: [['type', '==', 'app']],
      }
    );

    return () => unsubscribe();
  }, []);

  return { files, loading, error };
}

/**
 * Share file hook
 */
export function useShareFile() {
  const user = useAuthStore((state) => state.user);
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const share = useCallback(
    async (fileId: string, targetUserId: string) => {
      if (!user?.uid) {
        throw new Error('User not authenticated');
      }

      setSharing(true);
      setError(null);

      try {
        await shareFileService(fileId, user.uid, targetUserId);
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setSharing(false);
      }
    },
    [user?.uid]
  );

  return { share, sharing, error };
}

/**
 * Unshare file hook
 */
export function useUnshareFile() {
  const user = useAuthStore((state) => state.user);
  const [unsharing, setUnsharing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const unshare = useCallback(
    async (fileId: string, targetUserId: string) => {
      if (!user?.uid) {
        throw new Error('User not authenticated');
      }

      setUnsharing(true);
      setError(null);

      try {
        await unshareFileService(fileId, user.uid, targetUserId);
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setUnsharing(false);
      }
    },
    [user?.uid]
  );

  return { unshare, unsharing, error };
}

