/**
 * File Upload Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Component for uploading files with progress and validation
 */

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from 'heroui-native';
import { useUploadFile } from '@/hooks/use-files';
import { useFileUploadLimits, useFileManagementEnabled } from '@/hooks/use-config';
import { useUserFileCount, useUserFileLimit } from '@/hooks/use-permissions';
import { pickFiles } from '@/components/utils/file-picker';
import { validateFileSize, validateFileType, formatFileSize } from '@/services/storage/storage.service';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { FormButton } from '@/components/forms/FormButton';
import type { FileUploadData } from '@/services/files/file.service';

interface FileUploadProps {
  type: 'personal' | 'app' | 'group';
  groupId?: string;
  onUploadComplete?: (fileId: string, downloadURL: string) => void;
  onUploadError?: (error: Error) => void;
  disabled?: boolean;
}

export function FileUpload({
  type,
  groupId,
  onUploadComplete,
  onUploadError,
  disabled = false,
}: FileUploadProps) {
  const { colors, theme } = useTheme();
  const { upload, uploading, progress, error: uploadError } = useUploadFile();
  const { maxFileSize, allowedFileTypes } = useFileUploadLimits();
  const fileCount = useUserFileCount();
  const fileLimit = useUserFileLimit();
  const fileManagementEnabled = useFileManagementEnabled();
  const [error, setError] = useState<string | null>(null);

  const handleFilePick = useCallback(async () => {
    if (!fileManagementEnabled) {
      setError('File management is disabled');
      return;
    }

    if (fileCount >= fileLimit) {
      setError(`File upload limit reached. Maximum ${fileLimit} files allowed.`);
      return;
    }

    try {
      setError(null);
      const files = await pickFiles({
        allowMultiple: false,
        maxSize: maxFileSize,
      });

      if (files.length === 0) {
        return;
      }

      const file = files[0];

      // Validate file size
      const sizeValidation = validateFileSize(file.size, maxFileSize);
      if (!sizeValidation.valid) {
        setError(sizeValidation.error || 'File size validation failed');
        return;
      }

      // Validate file type
      if (file.mimeType) {
        const typeValidation = validateFileType(file.mimeType, allowedFileTypes);
        if (!typeValidation.valid) {
          setError(typeValidation.error || 'File type validation failed');
          return;
        }
      }

      // Prepare upload data
      const uploadData: FileUploadData = {
        file: {
          uri: file.uri,
          name: file.name,
          type: file.mimeType,
          size: file.size,
        },
        name: file.name,
        type,
        groupId,
        isAppFile: type === 'app',
      };

      // Upload file
      const result = await upload(uploadData);
      onUploadComplete?.(result.fileId, result.downloadURL);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      onUploadError?.(error);
    }
  }, [
    fileManagementEnabled,
    fileCount,
    fileLimit,
    maxFileSize,
    allowedFileTypes,
    type,
    groupId,
    upload,
    onUploadComplete,
    onUploadError,
  ]);

  const isDisabled = disabled || uploading || !fileManagementEnabled || fileCount >= fileLimit;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleFilePick}
        disabled={isDisabled}
        style={[
          styles.uploadButton,
          {
            backgroundColor: colors.surface1,
            borderColor: colors.border,
            opacity: isDisabled ? 0.5 : 1,
          },
        ]}
        activeOpacity={0.7}
      >
        {uploading ? (
          <View style={styles.uploading}>
            <ActivityIndicator size="small" color={colors.accent} />
            <Text style={[styles.uploadingText, { color: colors.foreground }]}>
              Uploading... {progress}%
            </Text>
          </View>
        ) : (
          <View style={styles.uploadContent}>
            <IconSymbol
              name="plus.circle.fill"
              size={24}
              color={colors.accent}
            />
            <Text style={[styles.uploadText, { color: colors.foreground }]}>
              Upload File
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {(error || uploadError) && (
        <Text style={[styles.errorText, { color: colors.destructive }]}>
          {error || uploadError?.message}
        </Text>
      )}

      <View style={styles.info}>
        <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
          Max file size: {formatFileSize(maxFileSize)}
        </Text>
        <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
          Files: {fileCount}/{fileLimit}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  uploadButton: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  uploadContent: {
    alignItems: 'center',
    gap: 8,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '500',
  },
  uploading: {
    alignItems: 'center',
    gap: 8,
  },
  uploadingText: {
    fontSize: 14,
  },
  errorText: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  infoText: {
    fontSize: 12,
  },
});

