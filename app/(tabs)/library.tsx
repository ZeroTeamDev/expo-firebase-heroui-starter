/**
 * Library Screen
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * File management screen
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from 'heroui-native';
import { AppHeader } from '@/components/layout/AppHeader';
import { useTabBarPadding } from '@/hooks/use-tab-bar-padding';
import { FileUpload, FileList } from '@/components/files';
import { useFileManagementEnabled } from '@/hooks/use-config';
import { useDeleteFile } from '@/hooks/use-files';
import { useToast } from '@/components/feedback/Toast';
import { FeatureGuard } from '@/components/permissions/FeatureGuard';
import type { FileMetadata } from '@/services/permissions/permission.service';

export default function LibraryScreen() {
  const { colors, theme } = useTheme();
  const bottomPadding = useTabBarPadding();
  const fileManagementEnabled = useFileManagementEnabled();
  const { deleteFile, deleting } = useDeleteFile();
  const { showToast } = useToast();
  const [fileType, setFileType] = useState<'personal' | 'app' | 'group' | 'all'>('personal');

  const handleFileDelete = async (fileId: string) => {
    try {
      await deleteFile(fileId);
      showToast({
        title: 'Success',
        message: 'File deleted successfully',
        variant: 'success',
      });
    } catch (error) {
      showToast({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to delete file',
        variant: 'error',
      });
    }
  };

  const handleFilePress = (file: FileMetadata) => {
    // TODO: Implement file preview/open
    showToast({
      title: 'File',
      message: `Opening ${file.name}`,
      variant: 'info',
    });
  };

  const handleUploadComplete = (fileId: string, downloadURL: string) => {
    showToast({
      title: 'Success',
      message: 'File uploaded successfully',
      variant: 'success',
    });
  };

  const handleUploadError = (error: Error) => {
    showToast({
      title: 'Upload Error',
      message: error.message,
      variant: 'error',
    });
  };

  return (
    <FeatureGuard
      feature="enableFileManagement"
      fallback={
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <AppHeader title="Library" />
          <View style={styles.disabled}>
            <Text style={[styles.disabledText, { color: colors.mutedForeground }]}>
              File management is disabled
            </Text>
          </View>
        </View>
      }
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <AppHeader title="Library" />
        <View style={styles.content}>
          {/* File Type Filter */}
          <View style={styles.filterContainer}>
            <TouchableOpacity
              onPress={() => setFileType('personal')}
              style={[
                styles.filterButton,
                {
                  backgroundColor: fileType === 'personal' ? colors.accent : colors.surface1,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color: fileType === 'personal' ? '#fff' : colors.foreground,
                  },
                ]}
              >
                Personal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFileType('app')}
              style={[
                styles.filterButton,
                {
                  backgroundColor: fileType === 'app' ? colors.accent : colors.surface1,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color: fileType === 'app' ? '#fff' : colors.foreground,
                  },
                ]}
              >
                App
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFileType('all')}
              style={[
                styles.filterButton,
                {
                  backgroundColor: fileType === 'all' ? colors.accent : colors.surface1,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color: fileType === 'all' ? '#fff' : colors.foreground,
                  },
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
          </View>

          {/* File Upload */}
          {fileType === 'personal' && (
            <View style={styles.uploadSection}>
              <FileUpload
                type="personal"
                onUploadComplete={handleUploadComplete}
                onUploadError={handleUploadError}
              />
            </View>
          )}

          {/* File List */}
          <View style={styles.listSection}>
            <FileList
              type={fileType}
              onFilePress={handleFilePress}
              onFileDelete={handleFileDelete}
            />
          </View>
        </View>
      </View>
    </FeatureGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  uploadSection: {
    marginBottom: 16,
  },
  listSection: {
    flex: 1,
  },
  disabled: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  disabledText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
