// Created by Kien AI (leejungkiin@gmail.com)
import { registerModule } from '..';
import type { ModuleDefinition } from '../types';

const entertainmentModule: ModuleDefinition = {
  id: 'entertainment',
  title: 'Entertainment',
  routes: [{ path: '/modules/entertainment', title: 'Entertainment Home' }],
};

registerModule(entertainmentModule);
export default entertainmentModule;
