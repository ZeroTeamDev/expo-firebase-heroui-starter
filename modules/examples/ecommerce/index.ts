/**
 * E-commerce Example Module
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * E-commerce example with analytics tracking
 */

import type { ModuleDefinition } from '../../types';

const ecommerce: ModuleDefinition = {
  id: 'ecommerce' as any,
  title: 'E-commerce',
  icon: 'shopping-cart',
  routes: [
    {
      path: '/modules/examples/ecommerce',
      title: 'E-commerce',
    },
  ],
};

export default ecommerce;

