/**
 * Database Example Module
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Example module demonstrating database operations
 */

import type { ModuleDefinition } from '../../types';

const databaseExample: ModuleDefinition = {
  id: 'database-example' as any,
  title: 'Database Examples',
  icon: 'database',
  routes: [
    {
      path: '/modules/examples/database-example',
      title: 'Database Examples',
    },
  ],
};

export default databaseExample;

