/**
 * Storage Service
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Service for Firebase Storage operations
 */

import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, type StorageReference } from 'firebase/storage';
import { getFirebaseApp } from '@/integrations/firebase.client';

let storageInstance: ReturnType<typeof getStorage> | null = null;

/**
 * Get Firebase Storage instance
 */
function getStorageInstance() {
  if (storageInstance) {
    return storageInstance;
  }

  const app = getFirebaseApp();
  if (!app) {
    throw new Error('Firebase app is not initialized');
  }

  storageInstance = getStorage(app);
  return storageInstance;
}

export interface UploadFileOptions {
  metadata?: {
    contentType?: string;
    customMetadata?: Record<string, string>;
  };
  onProgress?: (progress: number) => void;
}

export interface UploadResult {
  storagePath: string;
  downloadURL: string;
  metadata: {
    size: number;
    contentType: string;
    fullPath: string;
  };
}

/**
 * Upload file to Firebase Storage
 */
export async function uploadFile(
  file: File | Blob | { uri: string; name: string; type?: string; size?: number },
  storagePath: string,
  options?: UploadFileOptions
): Promise<UploadResult> {
  const storage = getStorageInstance();
  const storageRef = ref(storage, storagePath);

  let fileBlob: Blob;
  let fileName: string;
  let fileSize: number;
  let fileType: string;

  // Handle different file types
  if (file instanceof File) {
    fileBlob = file;
    fileName = file.name;
    fileSize = file.size;
    fileType = file.type;
  } else if (file instanceof Blob) {
    fileBlob = file;
    fileName = 'file';
    fileSize = file.size;
    fileType = file.type || 'application/octet-stream';
  } else {
    // React Native file object with uri
    // For React Native, we need to fetch the file and convert to blob
    try {
      const response = await fetch(file.uri);
      fileBlob = await response.blob();
      fileName = file.name;
      fileSize = file.size || fileBlob.size;
      fileType = file.type || response.headers.get('content-type') || 'application/octet-stream';
    } catch (fetchError) {
      throw new Error(`Failed to read file: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`);
    }
  }

  const metadata = {
    contentType: fileType,
    ...options?.metadata,
  };

  // Upload file
  const uploadTask = uploadBytes(storageRef, fileBlob, metadata);

  // Handle progress if callback provided
  if (options?.onProgress) {
    // Note: uploadBytes doesn't support progress in web SDK
    // For progress tracking, we would need to use uploadBytesResumable
    // For now, we'll just call the callback with 100% after upload
    uploadTask.then(() => {
      options.onProgress?.(100);
    });
  }

  const snapshot = await uploadTask;
  const downloadURL = await getDownloadURL(snapshot.ref);

  return {
    storagePath,
    downloadURL,
    metadata: {
      size: fileSize,
      contentType: fileType,
      fullPath: snapshot.ref.fullPath,
    },
  };
}

/**
 * Get download URL for file
 */
export async function getFileUrl(storagePath: string): Promise<string> {
  const storage = getStorageInstance();
  const storageRef = ref(storage, storagePath);
  return await getDownloadURL(storageRef);
}

/**
 * Delete file from Firebase Storage
 */
export async function deleteFileFromStorage(storagePath: string): Promise<void> {
  const storage = getStorageInstance();
  const storageRef = ref(storage, storagePath);
  await deleteObject(storageRef);
}

/**
 * Validate file size
 */
export function validateFileSize(fileSize: number, maxSize: number): {
  valid: boolean;
  error?: string;
} {
  if (fileSize > maxSize) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${formatFileSize(maxSize)}`,
    };
  }
  return { valid: true };
}

/**
 * Validate file type
 */
export function validateFileType(
  mimeType: string,
  allowedTypes: string[]
): {
  valid: boolean;
  error?: string;
} {
  if (allowedTypes.length === 0) {
    // No restrictions
    return { valid: true };
  }

  if (!allowedTypes.includes(mimeType)) {
    return {
      valid: false,
      error: `File type ${mimeType} is not allowed. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }

  return { valid: true };
}

/**
 * Format file size to human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

