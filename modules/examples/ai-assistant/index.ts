/**
 * AI Assistant Example Module
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * AI assistant example demonstrating AI features
 */

import type { ModuleDefinition } from '../../types';

const aiAssistant: ModuleDefinition = {
  id: 'ai-assistant' as any,
  title: 'AI Assistant',
  icon: 'sparkles',
  routes: [
    {
      path: '/modules/examples/ai-assistant',
      title: 'AI Assistant',
    },
  ],
};

export default aiAssistant;

