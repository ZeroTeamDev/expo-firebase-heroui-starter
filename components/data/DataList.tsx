// Created by Kien AI (leejungkiin@gmail.com)
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Platform } from 'react-native';
import { useTheme } from 'heroui-native';

export interface DataListProps<T> {
  data: ReadonlyArray<T>;
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T, index: number) => string;
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  ListEmptyComponent?: React.ReactNode;
  ListHeaderComponent?: React.ReactNode;
  ListFooterComponent?: React.ReactNode;
  ItemSeparatorComponent?: React.ComponentType | null;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  showsScrollIndicator?: boolean;
  estimatedItemSize?: number;
  scrollEnabled?: boolean;
  nestedScrollEnabled?: boolean;
}

export function DataList<T>({
  data,
  renderItem,
  keyExtractor,
  loading = false,
  refreshing = false,
  onRefresh,
  onEndReached,
  onEndReachedThreshold = 0.5,
  ListEmptyComponent,
  ListHeaderComponent,
  ListFooterComponent,
  ItemSeparatorComponent,
  contentContainerStyle,
  style,
  showsScrollIndicator = false,
  estimatedItemSize,
  scrollEnabled = true,
  nestedScrollEnabled = true,
}: DataListProps<T>) {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';
  const isWeb = Platform.OS === 'web';
  const listGap = isWeb ? 12 : 8;
  const emptyPadding = isWeb ? 48 : 32;
  const loadingPadding = isWeb ? 28 : 20;
  const footerPadding = isWeb ? 16 : 12;

  const defaultEmpty = (
    <View style={[styles.emptyContainer, { paddingVertical: emptyPadding }]}>
      <Text style={[styles.emptyLabel, { color: isDark ? '#94a3b8' : '#64748b' }]}>Nothing to display yet.</Text>
    </View>
  );

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

  return (
    <View style={[styles.container, style]}> 
      {loading && data.length === 0 ? (
        <View style={[styles.loadingContainer, { paddingVertical: loadingPadding }]}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : null}

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={(
          <>
            {ListFooterComponent}
            {loading && data.length > 0 ? (
              <View style={[styles.moreLoading, { paddingVertical: footerPadding }]}>
                <ActivityIndicator color={colors.accent} />
              </View>
            ) : null}
          </>
        )}
        ListEmptyComponent={!loading ? ListEmptyComponent ?? defaultEmpty : null}
        ItemSeparatorComponent={ItemSeparatorComponent}
        refreshControl={refreshControl}
        onEndReached={onEndReached}
        onEndReachedThreshold={onEndReachedThreshold}
        showsVerticalScrollIndicator={showsScrollIndicator}
        contentContainerStyle={[styles.listContent, { gap: listGap }, contentContainerStyle]}
        initialNumToRender={estimatedItemSize ? Math.ceil(320 / estimatedItemSize) : 8}
        windowSize={9}
        scrollEnabled={scrollEnabled}
        nestedScrollEnabled={nestedScrollEnabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  loadingContainer: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreLoading: {
    paddingVertical: 16,
  },
  listContent: {
    paddingVertical: 8,
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyLabel: {
    fontSize: 14,
  },
});


