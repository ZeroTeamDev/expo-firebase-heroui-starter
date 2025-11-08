/**
 * Notification Hook
 * Created by Kien AI (leejungkiin@gmail.com)
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import type { Notification, NotificationFilter, NotificationGroup } from './types';
import { mockNotifications } from './data';
import { useNotificationStore } from '@/stores/notificationStore';

export function useNotifications() {
  // Get notifications from store
  const notifications = useNotificationStore((state) => state.notifications);
  const notificationStore = useNotificationStore();
  const [filter, setFilter] = useState<NotificationFilter>({
    category: 'all',
    status: 'all',
  });

  // Initialize store with mock data if empty
  useEffect(() => {
    if (notifications.length === 0) {
      notificationStore.setNotifications(mockNotifications);
    }
  }, []);

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const categoryMatch = filter.category === 'all' || notification.category === filter.category;
      const statusMatch = filter.status === 'all' || notification.status === filter.status;
      return categoryMatch && statusMatch;
    });
  }, [notifications, filter]);

  // Group notifications by date
  const groupedNotifications = useMemo(() => {
    const now = Date.now();
    const today = new Date(now).setHours(0, 0, 0, 0);
    const yesterday = today - 24 * 60 * 60 * 1000;
    const oneWeekAgo = today - 7 * 24 * 60 * 60 * 1000;

    const groups: NotificationGroup[] = [];
    const todayGroup: Notification[] = [];
    const yesterdayGroup: Notification[] = [];
    const thisWeekGroup: Notification[] = [];
    const olderGroup: Notification[] = [];

    filteredNotifications.forEach((notification) => {
      const notificationDate = new Date(notification.timestamp).setHours(0, 0, 0, 0);

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
      groups.push({ label: 'Today', notifications: todayGroup });
    }
    if (yesterdayGroup.length > 0) {
      groups.push({ label: 'Yesterday', notifications: yesterdayGroup });
    }
    if (thisWeekGroup.length > 0) {
      groups.push({ label: 'This Week', notifications: thisWeekGroup });
    }
    if (olderGroup.length > 0) {
      groups.push({ label: 'Older', notifications: olderGroup });
    }

    return groups;
  }, [filteredNotifications]);

  // Mark as read
  const markAsRead = useCallback(
    (id: string) => {
      notificationStore.markAsRead(id);
    },
    [notificationStore]
  );

  // Mark as unread
  const markAsUnread = useCallback(
    (id: string) => {
      notificationStore.markAsUnread(id);
    },
    [notificationStore]
  );

  // Toggle read status
  const toggleReadStatus = useCallback(
    (id: string) => {
      const notification = notifications.find((n) => n.id === id);
      if (notification) {
        if (notification.status === 'read') {
          markAsUnread(id);
        } else {
          markAsRead(id);
        }
      }
    },
    [notifications, markAsRead, markAsUnread]
  );

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    notificationStore.markAllAsRead();
  }, [notificationStore]);

  // Delete notification
  const deleteNotification = useCallback(
    (id: string) => {
      notificationStore.deleteNotification(id);
    },
    [notificationStore]
  );

  // Delete all read
  const deleteAllRead = useCallback(() => {
    const readIds = notifications.filter((n) => n.status === 'read').map((n) => n.id);
    readIds.forEach((id) => notificationStore.deleteNotification(id));
  }, [notifications, notificationStore]);

  // Delete multiple notifications
  const deleteNotifications = useCallback(
    (ids: string[]) => {
      ids.forEach((id) => notificationStore.deleteNotification(id));
    },
    [notificationStore]
  );

  // Update filter
  const updateFilter = useCallback((newFilter: Partial<NotificationFilter>) => {
    setFilter((prev) => ({ ...prev, ...newFilter }));
  }, []);

  // Get unread count from store
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  // Get unread count by category
  const unreadCountByCategory = useMemo(() => {
    const counts: Record<string, number> = {
      all: 0,
      system: 0,
      messages: 0,
      updates: 0,
      alerts: 0,
    };

    notifications.forEach((notification) => {
      if (notification.status === 'unread') {
        counts.all++;
        counts[notification.category]++;
      }
    });

    return counts;
  }, [notifications]);

  return {
    notifications,
    filteredNotifications,
    groupedNotifications,
    filter,
    updateFilter,
    markAsRead,
    markAsUnread,
    toggleReadStatus,
    markAllAsRead,
    deleteNotification,
    deleteAllRead,
    deleteNotifications,
    unreadCount,
    unreadCountByCategory,
  };
}

