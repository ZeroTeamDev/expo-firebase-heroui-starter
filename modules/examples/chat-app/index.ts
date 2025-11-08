/**
 * Chat App Example Module
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Real-time chat example demonstrating real-time database operations
 */

import type { ModuleDefinition } from '../../types';

const chatApp: ModuleDefinition = {
  id: 'chat-app' as any,
  title: 'Chat App',
  icon: 'message-circle',
  routes: [
    {
      path: '/modules/examples/chat-app',
      title: 'Chat App',
    },
  ],
};

export default chatApp;

