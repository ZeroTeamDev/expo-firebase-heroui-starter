/**
 * AI Example Module
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Example module demonstrating AI operations
 */

import type { ModuleDefinition } from '../../types';

const aiExample: ModuleDefinition = {
  id: 'ai-example' as any,
  title: 'AI Examples',
  icon: 'sparkles',
  routes: [
    {
      path: '/modules/examples/ai-example',
      title: 'AI Examples',
    },
  ],
};

export default aiExample;

