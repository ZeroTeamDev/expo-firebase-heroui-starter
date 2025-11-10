/**
 * {{ModuleTitle}} Module
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * {{Description}}
 */

import type { ModuleDefinition } from '../../modules/types';

const {{moduleId}}: ModuleDefinition = {
  id: '{{moduleId}}' as any,
  title: '{{ModuleTitle}}',
  icon: 'layout-grid',
  routes: [
    {
      path: '/modules/{{category}}/{{moduleId}}',
      title: '{{ModuleTitle}}',
    },
  ],
};

export default {{moduleId}};

