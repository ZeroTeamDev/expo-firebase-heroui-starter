/**
 * Notification Types
 * Created by Kien AI (leejungkiin@gmail.com)
 */

export type NotificationCategory = 'system' | 'messages' | 'updates' | 'alerts';

export type NotificationVariant = 'default' | 'success' | 'error' | 'info' | 'warning';

export type NotificationStatus = 'read' | 'unread';

export interface NotificationAction {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  variant: NotificationVariant;
  status: NotificationStatus;
  timestamp: number;
  icon?: string;
  image?: string;
  actions?: NotificationAction[];
  data?: Record<string, any>;
}

export type NotificationFilter = {
  category: NotificationCategory | 'all';
  status: NotificationStatus | 'all';
};

export interface NotificationGroup {
  label: string;
  notifications: Notification[];
}

