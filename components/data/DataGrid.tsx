// Created by Kien AI (leejungkiin@gmail.com)
import React, { useMemo } from 'react';
import {
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleProp,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from 'heroui-native';

export interface DataGridProps<T> {
  data: ReadonlyArray<T>;
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T, index: number) => string;
  minColumnWidth?: number;
  maxColumns?: number;
  spacing?: number;
  ListHeaderComponent?: React.ReactNode;
  ListEmptyComponent?: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  showsScrollIndicator?: boolean;
  scrollEnabled?: boolean;
  nestedScrollEnabled?: boolean;
}

export function DataGrid<T>({
  data,
  renderItem,
  keyExtractor,
  minColumnWidth = 180,
  maxColumns = 4,
  spacing = 12,
  ListHeaderComponent,
  ListEmptyComponent,
  contentContainerStyle,
  style,
  loading = false,
  refreshing = false,
  onRefresh,
  onEndReached,
  onEndReachedThreshold = 0.6,
  showsScrollIndicator = false,
  scrollEnabled = true,
  nestedScrollEnabled = true,
}: DataGridProps<T>) {
  const { width } = useWindowDimensions();
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  const numColumns = useMemo(() => {
    const available = Math.max(1, width - 48); // account for typical padding
    const computed = Math.max(1, Math.floor(available / Math.max(minColumnWidth, 120)));
    return Math.min(maxColumns, computed);
  }, [maxColumns, minColumnWidth, width]);

  const refreshControl = onRefresh
    ? (
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.accent}
          colors={[colors.accent]}
        />
      )
    : undefined;

  const defaultEmpty = (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyLabel, { color: isDark ? '#94a3b8' : '#64748b' }]}>No items available.</Text>
    </View>
  );

  return (
    <View style={[styles.container, style]}> 
      <FlatList
        data={data}
        key={numColumns}
        keyExtractor={keyExtractor}
        renderItem={(info) => (
          <View style={{ flex: 1 / numColumns, padding: spacing / 2 }}>
            {renderItem(info)}
          </View>
        )}
        numColumns={numColumns}
        columnWrapperStyle={
          numColumns > 1 ? { gap: spacing, paddingHorizontal: spacing / 2 } : undefined
        }
        contentContainerStyle={[
          styles.gridContent,
          { paddingVertical: spacing, gap: spacing },
          contentContainerStyle,
        ]}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={!loading ? ListEmptyComponent ?? defaultEmpty : null}
        refreshControl={refreshControl}
        onEndReached={onEndReached}
        onEndReachedThreshold={onEndReachedThreshold}
        showsVerticalScrollIndicator={showsScrollIndicator}
        scrollEnabled={scrollEnabled}
        nestedScrollEnabled={nestedScrollEnabled}
        ListFooterComponent={loading && data.length > 0 ? (
          <View style={styles.loadingMore}>
            <Text style={[styles.loadingLabel, { color: isDark ? '#cbd5f5' : '#334155' }]}>Loading…</Text>
          </View>
        ) : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gridContent: {
    paddingHorizontal: 12,
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyLabel: {
    fontSize: 14,
  },
  loadingMore: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  loadingLabel: {
    fontSize: 13,
  },
});


