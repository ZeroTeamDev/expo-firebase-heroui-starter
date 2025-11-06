// Created by Kien AI (leejungkiin@gmail.com)
import { registerModule } from '..';
import type { ModuleDefinition } from '../types';

const saasModule: ModuleDefinition = {
  id: 'saas',
  title: 'SaaS',
  routes: [{ path: '/modules/saas', title: 'SaaS Utilities' }],
};

registerModule(saasModule);
export default saasModule;
