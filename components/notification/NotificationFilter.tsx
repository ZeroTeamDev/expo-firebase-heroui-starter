/**
 * Notification Filter Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Filter bar for notifications by category and status
 */

import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTheme } from 'heroui-native';
import { Badge } from '@/components/feedback/Badge';
import type { NotificationCategory, NotificationStatus } from '@/app/modules/examples/notification-example/types';
import type { NotificationFilter as NotificationFilterType } from '@/app/modules/examples/notification-example/types';

export interface NotificationFilterProps {
  filter: NotificationFilterType;
  onFilterChange: (filter: Partial<NotificationFilterType>) => void;
  unreadCounts?: Record<string, number>;
}

export function NotificationFilter({
  filter,
  onFilterChange,
  unreadCounts = {},
}: NotificationFilterProps) {
  const { colors } = useTheme();

  const categories: Array<{ value: NotificationCategory | 'all'; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'system', label: 'System' },
    { value: 'messages', label: 'Messages' },
    { value: 'updates', label: 'Updates' },
    { value: 'alerts', label: 'Alerts' },
  ];

  const statuses: Array<{ value: NotificationStatus | 'all'; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'unread', label: 'Unread' },
    { value: 'read', label: 'Read' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <View style={styles.labelContainer}>
            <Badge label="Category" variant="outline" size="sm" />
          </View>
          <View style={styles.badges}>
            {categories.map((category) => {
              const isSelected = filter.category === category.value;
              const unreadCount = unreadCounts[category.value] || 0;
              return (
                <Badge
                  key={category.value}
                  label={unreadCount > 0 ? `${category.label} (${unreadCount})` : category.label}
                  variant={isSelected ? 'accent' : 'outline'}
                  size="sm"
                  onPress={() => onFilterChange({ category: category.value })}
                  style={styles.badge}
                />
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.labelContainer}>
            <Badge label="Status" variant="outline" size="sm" />
          </View>
          <View style={styles.badges}>
            {statuses.map((status) => {
              const isSelected = filter.status === status.value;
              return (
                <Badge
                  key={status.value}
                  label={status.label}
                  variant={isSelected ? 'accent' : 'outline'}
                  size="sm"
                  onPress={() => onFilterChange({ status: status.value })}
                  style={styles.badge}
                />
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148,163,184,0.15)',
  },
  scrollContent: {
    gap: 10,
    paddingRight: 12,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  labelContainer: {
    marginRight: 2,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    minWidth: 50,
  },
});

