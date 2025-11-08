/**
 * Notification Example Module
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Complete notification system example with inbox, settings, and push notification UI
 */

import type { ModuleDefinition } from '../../types';

const notificationExample: ModuleDefinition = {
  id: 'notification-example' as any,
  title: 'Notification Example',
  icon: 'bell',
  routes: [
    {
      path: '/modules/examples/notification-example',
      title: 'Notification Inbox',
    },
    {
      path: '/modules/examples/notification-example/settings',
      title: 'Notification Settings',
    },
  ],
};

export default notificationExample;

