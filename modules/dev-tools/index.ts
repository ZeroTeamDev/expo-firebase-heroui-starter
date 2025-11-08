/**
 * Dev Tools Module
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Development tools for debugging and testing
 */

import type { ModuleDefinition } from '../types';

const devTools: ModuleDefinition = {
  id: 'dev-tools' as any,
  title: 'Dev Tools',
  icon: 'settings',
  routes: [
    {
      path: '/modules/dev-tools',
      title: 'Dev Tools',
    },
    {
      path: '/modules/dev-tools/database',
      title: 'Database Browser',
    },
    {
      path: '/modules/dev-tools/analytics',
      title: 'Analytics Debugger',
    },
    {
      path: '/modules/dev-tools/ai',
      title: 'AI Playground',
    },
  ],
};

export default devTools;

