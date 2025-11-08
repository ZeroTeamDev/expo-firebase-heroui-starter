/**
 * Todo App Example Module
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Full CRUD app example demonstrating database operations
 */

import type { ModuleDefinition } from '../../types';

const todoApp: ModuleDefinition = {
  id: 'todo-app' as any,
  title: 'Todo App',
  icon: 'check-square',
  routes: [
    {
      path: '/modules/examples/todo-app',
      title: 'Todo App',
    },
  ],
};

export default todoApp;

