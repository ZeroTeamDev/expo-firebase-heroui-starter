/**
 * File List Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Component for displaying list of files with filters
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useTheme } from 'heroui-native';
import { useFiles, useAllFiles, useUserFiles, useGroupFiles, useAppFiles } from '@/hooks/use-files';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { FileMetadata } from '@/services/permissions/permission.service';
import { formatFileSize } from '@/services/storage/storage.service';

interface FileListProps {
  type?: 'personal' | 'app' | 'group' | 'all';
  groupId?: string;
  userId?: string;
  adminMode?: boolean; // Admin can see all files without permission filtering
  onFilePress?: (file: FileMetadata) => void;
  onFileDelete?: (file: FileMetadata) => void;
}

export function FileList({
  type = 'all',
  groupId,
  userId,
  adminMode = false,
  onFilePress,
  onFileDelete,
}: FileListProps) {
  const { colors, theme } = useTheme();
  const [filter, setFilter] = useState<'personal' | 'app' | 'group' | 'all'>(type);

  // Get files based on type
  // Use useAllFiles for admin mode to bypass permission checks
  const { files: allFiles, loading: loadingAll } = adminMode ? useAllFiles() : useFiles();
  const { files: userFiles, loading: loadingUser } = useUserFiles(userId);
  const { files: groupFiles, loading: loadingGroup } = useGroupFiles(groupId || null);
  const { files: appFiles, loading: loadingApp } = useAppFiles();

  const loading = loadingAll || loadingUser || loadingGroup || loadingApp;

  // Filter files based on type
  const files = React.useMemo(() => {
    if (adminMode && filter === 'all') {
      // Admin mode: return all files
      return allFiles;
    }

    switch (filter) {
      case 'personal':
        return userFiles;
      case 'app':
        return appFiles;
      case 'group':
        return groupFiles;
      case 'all':
      default:
        return allFiles;
    }
  }, [filter, allFiles, userFiles, groupFiles, appFiles, adminMode]);

  const renderFileItem = ({ item }: { item: FileMetadata }) => {
    return (
      <TouchableOpacity
        onPress={() => onFilePress?.(item)}
        style={[styles.fileItem, { backgroundColor: colors.surface1 }]}
        activeOpacity={0.7}
      >
        <View style={styles.fileIcon}>
          <IconSymbol
            name="doc.fill"
            size={24}
            color={colors.accent}
          />
        </View>
        <View style={styles.fileInfo}>
          <Text style={[styles.fileName, { color: colors.foreground }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.fileMeta, { color: colors.mutedForeground }]}>
            {formatFileSize(item.size)} • {item.type}
          </Text>
        </View>
        {onFileDelete && (
          <TouchableOpacity
            onPress={() => onFileDelete(item)}
            style={styles.deleteButton}
          >
            <IconSymbol
              name="trash.fill"
              size={20}
              color={colors.destructive}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
          Loading files...
        </Text>
      </View>
    );
  }

  if (files.length === 0) {
    return (
      <View style={styles.empty}>
        <IconSymbol
          name="folder.fill"
          size={48}
          color={colors.mutedForeground}
        />
        <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
          No files found
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={files}
        renderItem={renderFileItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
    gap: 8,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  fileIcon: {
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
    minWidth: 0,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  fileMeta: {
    fontSize: 12,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 14,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 16,
  },
});

