/**
 * File Picker Utilities
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Utilities for file selection and validation
 */

import * as DocumentPicker from 'expo-document-picker';
import { Platform } from 'react-native';

export interface FilePickerOptions {
  allowMultiple?: boolean;
  accept?: string[];
  maxSize?: number; // in bytes
}

export interface PickedFile {
  uri: string;
  name: string;
  size: number;
  mimeType: string | null;
}

export async function pickFiles(options: FilePickerOptions = {}): Promise<PickedFile[]> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      multiple: options.allowMultiple ?? false,
      type: options.accept?.join(',') ?? '*/*',
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      return [];
    }

    const files = result.canceled ? [] : (Array.isArray(result.assets) ? result.assets : [result.assets]);
    
    const pickedFiles: PickedFile[] = files.map((file) => ({
      uri: file.uri,
      name: file.name ?? 'Unknown',
      size: file.size ?? 0,
      mimeType: file.mimeType ?? null,
    }));

    // Validate file sizes if maxSize is provided
    if (options.maxSize) {
      const invalidFiles = pickedFiles.filter((file) => file.size > options.maxSize!);
      if (invalidFiles.length > 0) {
        throw new Error(
          `File size exceeds maximum allowed size of ${formatFileSize(options.maxSize)}. ` +
          `Invalid files: ${invalidFiles.map((f) => f.name).join(', ')}`,
        );
      }
    }

    return pickedFiles;
  } catch (error) {
    console.error('File picker error:', error);
    throw error;
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
}

export function validateFileType(file: PickedFile, acceptedTypes: string[]): boolean {
  if (acceptedTypes.length === 0 || acceptedTypes.includes('*/*')) {
    return true;
  }

  if (!file.mimeType) {
    // Fallback to extension check if mimeType is not available
    const extension = file.name.split('.').pop()?.toLowerCase();
    return acceptedTypes.some((type) => {
      const normalizedType = type.toLowerCase().replace('*', '');
      return extension && type.includes(extension);
    });
  }

  return acceptedTypes.some((type) => {
    if (type.includes('*')) {
      const baseType = type.split('/')[0];
      return file.mimeType?.startsWith(baseType + '/') ?? false;
    }
    return file.mimeType === type;
  });
}

export function getFileIcon(mimeType: string | null): string {
  if (!mimeType) return '📄';
  
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType.startsWith('video/')) return '🎥';
  if (mimeType.startsWith('audio/')) return '🎵';
  if (mimeType.includes('pdf')) return '📕';
  if (mimeType.includes('word') || mimeType.includes('document')) return '📘';
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📗';
  if (mimeType.includes('zip') || mimeType.includes('archive')) return '📦';
  
  return '📄';
}


