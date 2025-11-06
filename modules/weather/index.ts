// Created by Kien AI (leejungkiin@gmail.com)
import { registerModule } from '..';
import type { ModuleDefinition } from '../types';

const weatherModule: ModuleDefinition = {
  id: 'weather',
  title: 'Weather',
  routes: [{ path: '/modules/weather', title: 'Weather Home' }],
};

registerModule(weatherModule);
export default weatherModule;
