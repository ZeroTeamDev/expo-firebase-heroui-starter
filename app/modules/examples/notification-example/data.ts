/**
 * Mock Notification Data
 * Created by Kien AI (leejungkiin@gmail.com)
 */

import type { Notification } from './types';

const now = Date.now();
const oneHourAgo = now - 60 * 60 * 1000;
const threeHoursAgo = now - 3 * 60 * 60 * 1000;
const yesterday = now - 24 * 60 * 60 * 1000;
const twoDaysAgo = now - 2 * 24 * 60 * 60 * 1000;
const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

export const mockNotifications: Notification[] = [
  // Today - System
  {
    id: '1',
    title: 'App Update Available',
    message: 'A new version of the app is available. Update now to get the latest features.',
    category: 'system',
    variant: 'info',
    status: 'unread',
    timestamp: oneHourAgo,
    icon: '🔔',
    actions: [
      {
        label: 'Update',
        onPress: () => console.log('Update pressed'),
        variant: 'primary',
      },
      {
        label: 'Later',
        onPress: () => console.log('Later pressed'),
        variant: 'secondary',
      },
    ],
  },
  {
    id: '2',
    title: 'Maintenance Scheduled',
    message: 'Scheduled maintenance will occur tonight from 2 AM to 4 AM.',
    category: 'system',
    variant: 'warning',
    status: 'read',
    timestamp: threeHoursAgo,
    icon: '⚙️',
  },
  // Today - Messages
  {
    id: '3',
    title: 'New Message',
    message: 'You have a new message from John Doe.',
    category: 'messages',
    variant: 'default',
    status: 'unread',
    timestamp: now - 30 * 60 * 1000,
    icon: '💬',
  },
  {
    id: '4',
    title: 'Message Reply',
    message: 'Sarah replied to your message.',
    category: 'messages',
    variant: 'default',
    status: 'unread',
    timestamp: now - 15 * 60 * 1000,
    icon: '💬',
  },
  {
    id: '5',
    title: 'Group Message',
    message: 'New message in Design Team group.',
    category: 'messages',
    variant: 'default',
    status: 'read',
    timestamp: twoDaysAgo,
    icon: '👥',
  },
  // Today - Updates
  {
    id: '6',
    title: 'Feature Update',
    message: 'New features are now available! Check out the latest updates.',
    category: 'updates',
    variant: 'success',
    status: 'unread',
    timestamp: now - 45 * 60 * 1000,
    icon: '✨',
  },
  {
    id: '7',
    title: 'Announcement',
    message: 'We have exciting news to share with you.',
    category: 'updates',
    variant: 'info',
    status: 'read',
    timestamp: yesterday,
    icon: '📢',
  },
  // Today - Alerts
  {
    id: '8',
    title: 'Payment Failed',
    message: 'Your payment could not be processed. Please update your payment method.',
    category: 'alerts',
    variant: 'error',
    status: 'unread',
    timestamp: now - 20 * 60 * 1000,
    icon: '⚠️',
    actions: [
      {
        label: 'Update Payment',
        onPress: () => console.log('Update payment pressed'),
        variant: 'primary',
      },
    ],
  },
  {
    id: '9',
    title: 'Security Alert',
    message: 'A new device has logged into your account.',
    category: 'alerts',
    variant: 'warning',
    status: 'unread',
    timestamp: now - 10 * 60 * 1000,
    icon: '🔒',
    actions: [
      {
        label: 'View Details',
        onPress: () => console.log('View details pressed'),
        variant: 'primary',
      },
    ],
  },
  // Yesterday
  {
    id: '10',
    title: 'Task Completed',
    message: 'Your task "Design new UI" has been marked as completed.',
    category: 'system',
    variant: 'success',
    status: 'read',
    timestamp: yesterday,
    icon: '✅',
  },
  {
    id: '11',
    title: 'New Follower',
    message: 'John Doe started following you.',
    category: 'updates',
    variant: 'default',
    status: 'read',
    timestamp: yesterday + 2 * 60 * 60 * 1000,
    icon: '👤',
  },
  // Older
  {
    id: '12',
    title: 'Weekly Report',
    message: 'Your weekly activity report is ready.',
    category: 'system',
    variant: 'info',
    status: 'read',
    timestamp: twoDaysAgo,
    icon: '📊',
  },
  {
    id: '13',
    title: 'Event Reminder',
    message: 'You have an event starting in 1 hour.',
    category: 'alerts',
    variant: 'info',
    status: 'read',
    timestamp: oneWeekAgo,
    icon: '📅',
  },
];

