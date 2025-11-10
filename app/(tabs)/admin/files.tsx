/**
 * File Management Screen (Admin)
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Admin screen for managing all files
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTheme } from 'heroui-native';
import { AppHeader } from '@/components/layout/AppHeader';
import { AdminOnly } from '@/components/permissions/AdminOnly';
import { FileList } from '@/components/files';
import { useDeleteFile } from '@/hooks/use-files';
import { useToast } from '@/components/feedback/Toast';
import { useTabBarPadding } from '@/hooks/use-tab-bar-padding';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { FileMetadata } from '@/services/permissions/permission.service';

export default function AdminFileManagementScreen() {
  const { colors } = useTheme();
  const bottomPadding = useTabBarPadding();
  const { deleteFile } = useDeleteFile();
  const { showToast } = useToast();
  const [fileType, setFileType] = useState<'personal' | 'app' | 'group' | 'all'>('all');

  const handleFileDelete = (file: FileMetadata) => {
    Alert.alert(
      'Delete File',
      `Are you sure you want to delete "${file.name}"? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteFile(file.id);
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
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleFilePress = (file: FileMetadata) => {
    // TODO: Implement file preview/open for admin
    showToast({
      title: 'File Info',
      message: `File: ${file.name} (Owner: ${file.ownerId})`,
      variant: 'info',
    });
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
        <AppHeader title="File Management (Admin)" />
        
        {/* File Type Filter */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterPills}>
              {(['all', 'personal', 'app', 'group'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setFileType(type)}
                  style={[
                    styles.filterPill,
                    {
                      backgroundColor: fileType === type ? colors.accent : colors.surface1,
                      borderColor: fileType === type ? colors.accent : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      {
                        color: fileType === type ? '#ffffff' : colors.foreground,
                        fontWeight: fileType === type ? '600' : '400',
                      },
                    ]}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.content}>
          <FileList
            type={fileType}
            adminMode={true}
            onFilePress={handleFilePress}
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
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterPills: {
    flexDirection: 'row',
    gap: 8,
  },
  filterPill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 14,
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

