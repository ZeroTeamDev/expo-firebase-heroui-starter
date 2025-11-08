/**
 * Notification Inbox Screen
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Main notification inbox with filtering, grouping, and actions
 */

import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "heroui-native";
import { AppHeader } from "@/components/layout/AppHeader";
import { EmptyState } from "@/components/data/EmptyState";
import { useToast } from "@/components/feedback/Toast";
import { NotificationItem, NotificationTabs } from "@/components/notification";
import { useNotifications } from "./useNotifications";
import type { Notification } from "./types";
import type { NotificationTab } from "@/components/notification/NotificationTabs";

export default function NotificationInboxScreen() {
  const router = useRouter();
  const { colors, theme } = useTheme();
  const { showToast } = useToast();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<NotificationTab>("all");
  const isDark = theme === "dark";

  const {
    notifications,
    toggleReadStatus,
    markAllAsRead,
    deleteNotification,
    unreadCount,
  } = useNotifications();

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
    showToast({
      title: "Refreshed",
      message: "Notifications updated",
      variant: "success",
    });
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    showToast({
      title: "Success",
      message: "All notifications marked as read",
      variant: "success",
    });
  };

  const handleDelete = (id: string) => {
    deleteNotification(id);
    showToast({
      title: "Deleted",
      message: "Notification deleted",
      variant: "info",
    });
  };

  const handleToggleRead = (id: string) => {
    toggleReadStatus(id);
  };

  const handleNotificationPress = (notification: Notification) => {
    // Navigate to notification details or perform action
    if (notification.status === "unread") {
      handleToggleRead(notification.id);
    }
  };

  // Filter notifications based on active tab
  const getFilteredNotifications = () => {
    let filtered = notifications;

    // Filter by tab
    switch (activeTab) {
      case "unread":
        filtered = filtered.filter((n) => n.status === "unread");
        break;
      case "updates":
        filtered = filtered.filter(
          (n) => n.category === "updates" || n.category === "system"
        );
        break;
      case "mentions":
        filtered = filtered.filter((n) => n.category === "messages");
        break;
      case "all":
      default:
        // Show all
        break;
    }

    return filtered;
  };

  const filteredNotifications = getFilteredNotifications();

  // Group filtered notifications
  const getGroupedFilteredNotifications = () => {
    const now = Date.now();
    const today = new Date(now).setHours(0, 0, 0, 0);
    const yesterday = today - 24 * 60 * 60 * 1000;
    const oneWeekAgo = today - 7 * 24 * 60 * 60 * 1000;

    const groups: { label: string; notifications: Notification[] }[] = [];
    const todayGroup: Notification[] = [];
    const yesterdayGroup: Notification[] = [];
    const thisWeekGroup: Notification[] = [];
    const olderGroup: Notification[] = [];

    filteredNotifications.forEach((notification) => {
      const notificationDate = new Date(notification.timestamp).setHours(
        0,
        0,
        0,
        0
      );

      if (notificationDate >= today) {
        todayGroup.push(notification);
      } else if (notificationDate >= yesterday) {
        yesterdayGroup.push(notification);
      } else if (notificationDate >= oneWeekAgo) {
        thisWeekGroup.push(notification);
      } else {
        olderGroup.push(notification);
      }
    });

    if (todayGroup.length > 0) {
      groups.push({ label: "Today", notifications: todayGroup });
    }
    if (yesterdayGroup.length > 0) {
      groups.push({ label: "Yesterday", notifications: yesterdayGroup });
    }
    if (thisWeekGroup.length > 0) {
      groups.push({ label: "This Week", notifications: thisWeekGroup });
    }
    if (olderGroup.length > 0) {
      groups.push({ label: "Older", notifications: olderGroup });
    }

    return groups;
  };

  const displayGroups = getGroupedFilteredNotifications();
  const allDisplayNotifications = displayGroups.flatMap(
    (group) => group.notifications
  );

  const handleTabChange = (tab: NotificationTab) => {
    setActiveTab(tab);
  };

  const renderGroup = (group: {
    label: string;
    notifications: Notification[];
  }) => {
    // Only show group label if there are multiple groups
    const showGroupLabel = displayGroups.length > 1;

    return (
      <View key={group.label}>
        {showGroupLabel && (
          <Text
            style={[
              styles.groupLabel,
              { color: isDark ? "#71717a" : "#9ca3af" },
            ]}
          >
            {group.label}
          </Text>
        )}
        {group.notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onPress={handleNotificationPress}
            onToggleRead={handleToggleRead}
            onDelete={handleDelete}
          />
        ))}
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#000000" : "#f5f5f5" },
      ]}
    >
      <AppHeader
        title="Notifications"
        rightActions={
          <Pressable
            onPress={() =>
              router.push("/modules/examples/notification-example/settings")
            }
          >
            <Text style={[styles.settingsButton, { color: colors.accent }]}>
              Settings
            </Text>
          </Pressable>
        }
      />

      {/* Tabs Navigation */}
      <NotificationTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        unreadCount={unreadCount}
        showMarkAllRead={true}
        onMarkAllRead={handleMarkAllAsRead}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
      >
        {allDisplayNotifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <EmptyState
              title="No notifications"
              message={
                activeTab !== "all"
                  ? `No ${activeTab} notifications`
                  : "You have no notifications yet"
              }
              icon={<Text style={styles.emptyIcon}>🔔</Text>}
            />
          </View>
        ) : (
          <View style={styles.notificationsList}>
            {displayGroups.map(renderGroup)}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 0,
    paddingBottom: 100,
  },
  notificationsList: {
    gap: 0,
  },
  groupLabel: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 4,
    marginTop: 0,
  },
  emptyContainer: {
    paddingTop: 60,
  },
  emptyIcon: {
    fontSize: 64,
  },
  settingsButton: {
    fontSize: 16,
    fontWeight: "600",
  },
});
