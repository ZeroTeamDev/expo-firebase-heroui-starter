// Created by Kien AI (leejungkiin@gmail.com)
import { registerModule } from '..';
import type { ModuleDefinition } from '../types';

const aiToolsModule: ModuleDefinition = {
  id: 'ai-tools',
  title: 'AI Tools',
  routes: [{ path: '/modules/ai-tools', title: 'AI Tools' }],
};

registerModule(aiToolsModule);
export default aiToolsModule;
