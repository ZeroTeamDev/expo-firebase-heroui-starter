/**
 * Notification Tabs Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Tab navigation for notifications (Updates, Mentions, etc.)
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from 'heroui-native';

export type NotificationTab = 'all' | 'unread' | 'updates' | 'mentions';

export interface NotificationTabsProps {
  activeTab: NotificationTab;
  onTabChange: (tab: NotificationTab) => void;
  unreadCount?: number;
  showMarkAllRead?: boolean;
  onMarkAllRead?: () => void;
}

export function NotificationTabs({
  activeTab,
  onTabChange,
  unreadCount = 0,
  showMarkAllRead = true,
  onMarkAllRead,
}: NotificationTabsProps) {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  const tabs: Array<{ id: NotificationTab; label: string }> = [
    { id: 'all', label: 'All' },
    { id: 'updates', label: 'Updates' },
    { id: 'mentions', label: 'Mentions' },
  ];

  return (
    <View style={[styles.container, { borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]}>
      <View style={styles.tabs}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Pressable
              key={tab.id}
              onPress={() => onTabChange(tab.id)}
              style={[styles.tab, isActive && styles.tabActive]}
            >
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isActive
                      ? isDark
                        ? '#ffffff'
                        : '#000000'
                      : isDark
                      ? '#a1a1aa'
                      : '#6b7280',
                    fontWeight: isActive ? '600' : '400',
                  },
                ]}
              >
                {tab.label}
              </Text>
              {isActive && (
                <View style={[styles.tabIndicator, { backgroundColor: isDark ? '#ffffff' : '#000000' }]} />
              )}
            </Pressable>
          );
        })}
      </View>
      {showMarkAllRead && unreadCount > 0 && (
        <Pressable onPress={onMarkAllRead} style={styles.markAllButton}>
          <Text style={[styles.markAllText, { color: colors.accent || '#3b82f6' }]}>
            Mark all as read
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderBottomWidth: 1,
  },
  tabs: {
    flexDirection: 'row',
    gap: 20,
  },
  tab: {
    paddingVertical: 6,
    position: 'relative',
  },
  tabActive: {
    // Active state handled by indicator
  },
  tabLabel: {
    fontSize: 14,
    letterSpacing: -0.1,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    borderRadius: 1,
  },
  markAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  markAllText: {
    fontSize: 13,
    fontWeight: '500',
  },
});

