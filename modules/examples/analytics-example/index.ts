/**
 * Analytics Example Module
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Example module demonstrating analytics operations
 */

import type { ModuleDefinition } from '../../types';

const analyticsExample: ModuleDefinition = {
  id: 'analytics-example' as any,
  title: 'Analytics Examples',
  icon: 'chart.bar',
  routes: [
    {
      path: '/modules/examples/analytics-example',
      title: 'Analytics Examples',
    },
  ],
};

export default analyticsExample;

