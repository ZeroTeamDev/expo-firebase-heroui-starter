// Created by Kien AI (leejungkiin@gmail.com)
import { registerModule } from '..';
import type { ModuleDefinition } from '../types';

const managementModule: ModuleDefinition = {
  id: 'management',
  title: 'Management',
  routes: [{ path: '/modules/management', title: 'Management Home' }],
};

registerModule(managementModule);
export default managementModule;
