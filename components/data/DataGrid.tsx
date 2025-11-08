// Created by Kien AI (leejungkiin@gmail.com)
import React, { useMemo, useState, useCallback } from 'react';
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
  LayoutChangeEvent,
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
  const { width: windowWidth } = useWindowDimensions();
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';
  const [containerWidth, setContainerWidth] = useState(windowWidth);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    if (width > 0) {
      setContainerWidth(width);
    }
  }, []);

  const { numColumns, itemWidth } = useMemo(() => {
    // Use actual container width instead of window width for accurate calculation
    const available = Math.max(1, containerWidth);
    
    // Calculate number of columns based on minColumnWidth
    const computed = Math.max(1, Math.floor(available / Math.max(minColumnWidth, 120)));
    const cols = Math.min(maxColumns, computed);
    
    // Calculate actual item width
    // Available width minus spacing between columns
    const totalSpacing = (cols - 1) * spacing;
    const itemW = Math.max(100, Math.floor((available - totalSpacing) / cols));
    
    return {
      numColumns: cols,
      itemWidth: itemW,
    };
  }, [maxColumns, minColumnWidth, containerWidth, spacing]);

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
    <View 
      style={[styles.container, style]}
      onLayout={handleLayout}
    > 
      <FlatList
        data={data}
        key={numColumns}
        keyExtractor={keyExtractor}
        renderItem={(info) => (
          <View style={{ width: itemWidth }}>
            {renderItem(info)}
          </View>
        )}
        numColumns={numColumns}
        columnWrapperStyle={
          numColumns > 1 ? { gap: spacing, justifyContent: 'flex-start' } : undefined
        }
        contentContainerStyle={[
          styles.gridContent,
          { paddingVertical: spacing },
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
    paddingHorizontal: 0,
    gap: 0,
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


