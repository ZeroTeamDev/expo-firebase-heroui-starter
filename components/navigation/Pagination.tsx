// Created by Kien AI (leejungkiin@gmail.com)
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'heroui-native';

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  totalItems?: number;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20],
  totalItems,
}: PaginationProps) {
  const { colors } = useTheme();
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  const infoLabel = useMemo(() => {
    if (totalItems != null) {
      return `Page ${page} of ${totalPages} · ${totalItems} items`;
    }
    return `Page ${page} of ${totalPages}`;
  }, [page, totalItems, totalPages]);

  return (
    <View style={styles.container}>
      <Text style={[styles.info, { color: colors.mutedForeground || '#64748b' }]}>{infoLabel}</Text>

      <View style={styles.controls}>
        {onPageSizeChange ? (
          <View style={styles.pageSizeRow}>
            {pageSizeOptions.map((size) => {
              const selected = size === pageSize;
              return (
                <Pressable
                  key={size}
                  onPress={() => onPageSizeChange(size)}
                  style={[
                    styles.pageSizeChip,
                    { backgroundColor: selected ? colors.accent : 'rgba(148,163,184,0.15)' },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '600',
                      color: selected ? colors.accentForeground : colors.foreground,
                    }}
                  >
                    {size}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ) : null}

        <View style={styles.pageButtons}>
          <Pressable
            onPress={() => hasPrev && onPageChange(page - 1)}
            disabled={!hasPrev}
            style={[
              styles.navButton,
              { backgroundColor: hasPrev ? colors.accent : 'rgba(148,163,184,0.15)' },
              !hasPrev && styles.navButtonDisabled,
            ]}
          >
            <Text style={{ color: colors.accentForeground }}>Prev</Text>
          </Pressable>
          <Pressable
            onPress={() => hasNext && onPageChange(page + 1)}
            disabled={!hasNext}
            style={[
              styles.navButton,
              { backgroundColor: hasNext ? colors.accent : 'rgba(148,163,184,0.15)' },
              !hasNext && styles.navButtonDisabled,
            ]}
          >
            <Text style={{ color: colors.accentForeground }}>Next</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    gap: 12,
  },
  info: {
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pageSizeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  pageSizeChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pageButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  navButtonDisabled: {
    opacity: 0.6,
  },
});


