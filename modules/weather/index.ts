// Created by Kien AI (leejungkiin@gmail.com)
import type { ModuleDefinition } from '../types';

const weatherModule: ModuleDefinition = {
  id: 'weather',
  title: 'Weather',
  routes: [{ path: '/modules/weather', title: 'Weather Home' }],
};
export default weatherModule;
