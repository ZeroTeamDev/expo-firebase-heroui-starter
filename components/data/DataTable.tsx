// Created by Kien AI (leejungkiin@gmail.com)
import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from 'heroui-native';

export type DataTableSortDirection = 'asc' | 'desc';

export interface DataTableColumn<T> {
  key: keyof T | string;
  title: string;
  width?: number;
  flex?: number;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (row: T, rowIndex: number) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: Array<DataTableColumn<T>>;
  data: T[];
  loading?: boolean;
  emptyState?: React.ReactNode;
  sortKey?: string;
  sortDirection?: DataTableSortDirection;
  onSortChange?: (key: string, direction: DataTableSortDirection) => void;
  page?: number;
  pageSize?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  filters?: React.ReactNode;
  stickyHeader?: boolean;
  style?: ViewStyle;
}

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50];

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  emptyState,
  sortKey,
  sortDirection = 'asc',
  onSortChange,
  page = 1,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  filters,
  stickyHeader = true,
  style,
}: DataTableProps<T>) {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  const resolvedPageSize = pageSize ?? data.length;
  const resolvedTotalItems = totalItems ?? data.length;
  const totalPages = resolvedPageSize > 0 ? Math.max(1, Math.ceil(resolvedTotalItems / resolvedPageSize)) : 1;

  const headerBackground = isDark ? 'rgba(30,41,59,0.9)' : '#f1f5f9';
  const rowBackground = isDark ? 'rgba(15,23,42,0.9)' : '#fff';
  const borderColor = isDark ? 'rgba(148,163,184,0.2)' : 'rgba(148,163,184,0.4)';

  const renderSortIndicator = (columnKey: string, sortable?: boolean) => {
    if (!sortable || !onSortChange) return null;
    if (sortKey !== columnKey) {
      return <Text style={styles.sortIndicator}>↕︎</Text>;
    }
    return <Text style={styles.sortIndicator}>{sortDirection === 'asc' ? '↑' : '↓'}</Text>;
  };

  const headerContent = useMemo(
    () => (
      <View
        style={[
          styles.headerRow,
          { backgroundColor: headerBackground, borderBottomColor: borderColor },
          stickyHeader && styles.headerSticky,
        ]}
      >
        {columns.map((column) => {
          const columnKey = String(column.key);
          const canSort = Boolean(onSortChange && column.sortable);
          const alignment: 'flex-start' | 'center' | 'flex-end' =
            column.align === 'center' ? 'center' : column.align === 'right' ? 'flex-end' : 'flex-start';

          return (
            <Pressable
              key={columnKey}
              onPress={() => {
                if (!canSort) return;
                const nextDirection: DataTableSortDirection =
                  sortKey === columnKey ? (sortDirection === 'asc' ? 'desc' : 'asc') : 'asc';
                onSortChange?.(columnKey, nextDirection);
              }}
              style={[
                styles.headerCell,
                {
                  flex: column.flex ?? 1,
                  width: column.width,
                  justifyContent: alignment,
                },
              ]}
            >
              <Text
                style={[
                  styles.headerLabel,
                  { color: isDark ? '#f8fafc' : '#0f172a' },
                  canSort && styles.headerSortable,
                ]}
                numberOfLines={1}
              >
                {column.title}
              </Text>
              {renderSortIndicator(columnKey, column.sortable)}
            </Pressable>
          );
        })}
      </View>
    ),
    [
      borderColor,
      columns,
      headerBackground,
      isDark,
      onSortChange,
      sortDirection,
      sortKey,
      stickyHeader,
    ],
  );

  const renderRow = (row: T, rowIndex: number) => {
    const isOdd = rowIndex % 2 === 1;
    return (
      <View
        key={rowIndex}
        style={[
          styles.row,
          {
            backgroundColor: isOdd
              ? rowBackground
              : isDark
              ? 'rgba(15,23,42,0.7)'
              : 'rgba(248,250,252,0.9)',
            borderBottomColor: borderColor,
          },
        ]}
      >
        {columns.map((column) => {
          const columnKey = String(column.key);
          const alignment: 'flex-start' | 'center' | 'flex-end' =
            column.align === 'center' ? 'center' : column.align === 'right' ? 'flex-end' : 'flex-start';
          const value = column.render ? column.render(row, rowIndex) : row[column.key as keyof T];

          return (
            <View
              key={columnKey}
              style={[
                styles.cell,
                {
                  flex: column.flex ?? 1,
                  width: column.width,
                  alignItems: alignment,
                },
              ]}
            >
              {typeof value === 'string' || typeof value === 'number' ? (
                <Text style={[styles.cellLabel, { color: isDark ? '#e2e8f0' : '#1f2937' }]} numberOfLines={2}>
                  {value as any}
                </Text>
              ) : (
                value
              )}
            </View>
          );
        })}
      </View>
    );
  };

  const paginationControls = useMemo(() => {
    if (!onPageChange) return null;

    const hasPrev = page > 1;
    const hasNext = page < totalPages;

    return (
      <View style={[styles.paginationContainer, { borderTopColor: borderColor }]}> 
        <View style={styles.paginationInfo}>
          <Text style={[styles.paginationText, { color: isDark ? '#cbd5f5' : '#334155' }]}> 
            Page {page} of {totalPages}
          </Text>
          <Text style={[styles.paginationText, { color: isDark ? '#94a3b8' : '#64748b' }]}> 
            {resolvedTotalItems} items
          </Text>
        </View>

        <View style={styles.paginationActions}>
          {onPageSizeChange && (
            <View style={styles.pageSizeContainer}>
              {pageSizeOptions.map((size) => {
                const selected = size === resolvedPageSize;
                return (
                  <Pressable
                    key={size}
                    onPress={() => onPageSizeChange?.(size)}
                    style={[styles.pageSizeChip, selected && { backgroundColor: colors.accent }]}
                  >
                    <Text
                      style={[
                        styles.pageSizeLabel,
                        { color: selected ? colors.accentForeground : isDark ? '#cbd5f5' : '#1f2937' },
                      ]}
                    >
                      {size}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          <Pressable
            onPress={() => hasPrev && onPageChange(page - 1)}
            disabled={!hasPrev}
            style={[styles.pageButton, !hasPrev && styles.pageButtonDisabled]}
          >
            <Text style={styles.pageButtonLabel}>Prev</Text>
          </Pressable>

          <Pressable
            onPress={() => hasNext && onPageChange(page + 1)}
            disabled={!hasNext}
            style={[styles.pageButton, !hasNext && styles.pageButtonDisabled]}
          >
            <Text style={styles.pageButtonLabel}>Next</Text>
          </Pressable>
        </View>
      </View>
    );
  }, [
    borderColor,
    colors.accent,
    colors.accentForeground,
    isDark,
    onPageChange,
    onPageSizeChange,
    page,
    pageSizeOptions,
    resolvedPageSize,
    resolvedTotalItems,
    totalPages,
  ]);

  return (
    <View style={[styles.container, style, { borderColor }]}> 
      {filters && <View style={styles.filterContainer}>{filters}</View>}

      <ScrollView horizontal bounces={false} showsHorizontalScrollIndicator={false}>
        <View style={{ minWidth: '100%' }}>
          {headerContent}

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={colors.accent} />
            </View>
          ) : data.length === 0 ? (
            <View style={styles.emptyContainer}>
              {emptyState ?? (
                <Text style={[styles.emptyLabel, { color: isDark ? '#94a3b8' : '#64748b' }]}>No records found.</Text>
              )}
            </View>
          ) : (
            data.map(renderRow)
          )}
        </View>
      </ScrollView>

      {paginationControls}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  filterContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148,163,184,0.2)',
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 12,
  },
  headerSticky: {
    position: 'relative',
    zIndex: 2,
  },
  headerCell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  headerSortable: {
    textDecorationLine: 'underline',
  },
  sortIndicator: {
    fontSize: 12,
    color: '#94a3b8',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
  },
  cell: {
    justifyContent: 'center',
  },
  cellLabel: {
    fontSize: 14,
    lineHeight: 20,
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyLabel: {
    fontSize: 14,
  },
  paginationContainer: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  paginationInfo: {
    gap: 4,
  },
  paginationText: {
    fontSize: 12,
  },
  paginationActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pageSizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginRight: 12,
  },
  pageSizeChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(148,163,184,0.18)',
  },
  pageSizeLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  pageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(99,102,241,0.16)',
  },
  pageButtonDisabled: {
    opacity: 0.4,
  },
  pageButtonLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4f46e5',
  },
});


