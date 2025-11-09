/**
 * File Management Screen (Admin)
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Admin screen for managing all files
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'heroui-native';
import { AppHeader } from '@/components/layout/AppHeader';
import { AdminOnly } from '@/components/permissions/AdminOnly';
import { FileList } from '@/components/files';
import { useDeleteFile } from '@/hooks/use-files';
import { useToast } from '@/components/feedback/Toast';

export default function AdminFileManagementScreen() {
  const { colors } = useTheme();
  const { deleteFile } = useDeleteFile();
  const { showToast } = useToast();

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

  return (
    <AdminOnly
      fallback={
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <AppHeader title="File Management" />
          <View style={styles.unauthorized}>
            <Text style={[styles.unauthorizedText, { color: colors.foreground }]}>
              You do not have permission to access this area.
            </Text>
          </View>
        </View>
      }
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <AppHeader title="File Management" />
        <View style={styles.content}>
          <FileList
            type="all"
            onFileDelete={handleFileDelete}
          />
        </View>
      </View>
    </AdminOnly>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  unauthorized: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  unauthorizedText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

