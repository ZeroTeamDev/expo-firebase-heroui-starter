// Created by Kien AI (leejungkiin@gmail.com)
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'heroui-native';

export interface BreadcrumbItem {
  label: string;
  onPress?: () => void;
  isCurrent?: boolean;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: string;
  collapsedCount?: number;
}

export function Breadcrumbs({ items, separator = '/', collapsedCount = 5 }: BreadcrumbsProps) {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  if (!items || items.length === 0) {
    return null;
  }

  const shouldCollapse = items.length > collapsedCount;
  const head = shouldCollapse ? items.slice(0, 1) : items;
  const tail = shouldCollapse ? items.slice(items.length - (collapsedCount - 1)) : [];
  const displayItems = shouldCollapse ? [...head, { label: '…' }, ...tail] : items;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {displayItems.map((item, index) => {
        const isLast = index === displayItems.length - 1;
        const isEllipsis = item.label === '…' && !item.onPress;
        const isCurrent = item.isCurrent || isLast;

        const content = (
          <Text
            style={{
              color: isCurrent ? colors.foreground : colors.mutedForeground || (isDark ? '#94a3b8' : '#64748b'),
              fontWeight: isCurrent ? '600' : '500',
              fontSize: 13,
            }}
            numberOfLines={1}
          >
            {item.label}
          </Text>
        );

        return (
          <View key={`${item.label}-${index}`} style={styles.item}>
            {item.onPress && !isCurrent && !isEllipsis ? (
              <Pressable onPress={item.onPress} hitSlop={8}>
                {content}
              </Pressable>
            ) : (
              content
            )}
            {!isLast ? (
              <Text style={{ color: colors.mutedForeground || '#94a3b8', marginHorizontal: 6 }}>{separator}</Text>
            ) : null}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});


