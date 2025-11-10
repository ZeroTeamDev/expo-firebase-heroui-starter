/**
 * Notification Store
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Global state management for notifications
 */

import { create } from 'zustand';
import type { Notification } from '@/app/modules/examples/notification-example/types';

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAsUnread: (id: string) => void;
  deleteNotification: (id: string) => void;
  markAllAsRead: () => void;
  getUnreadCount: () => number;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => n.status === 'unread').length,
    }),

  addNotification: (notification) =>
    set((state) => {
      const newNotifications = [notification, ...state.notifications];
      return {
        notifications: newNotifications,
        unreadCount: newNotifications.filter((n) => n.status === 'unread').length,
      };
    }),

  markAsRead: (id) =>
    set((state) => {
      const newNotifications = state.notifications.map((n) =>
        n.id === id ? { ...n, status: 'read' as const } : n
      );
      return {
        notifications: newNotifications,
        unreadCount: newNotifications.filter((n) => n.status === 'unread').length,
      };
    }),

  markAsUnread: (id) =>
    set((state) => {
      const newNotifications = state.notifications.map((n) =>
        n.id === id ? { ...n, status: 'unread' as const } : n
      );
      return {
        notifications: newNotifications,
        unreadCount: newNotifications.filter((n) => n.status === 'unread').length,
      };
    }),

  deleteNotification: (id) =>
    set((state) => {
      const newNotifications = state.notifications.filter((n) => n.id !== id);
      return {
        notifications: newNotifications,
        unreadCount: newNotifications.filter((n) => n.status === 'unread').length,
      };
    }),

  markAllAsRead: () =>
    set((state) => {
      const newNotifications = state.notifications.map((n) => ({ ...n, status: 'read' as const }));
      return {
        notifications: newNotifications,
        unreadCount: 0,
      };
    }),

  getUnreadCount: () => {
    return get().notifications.filter((n) => n.status === 'unread').length;
  },
}));

