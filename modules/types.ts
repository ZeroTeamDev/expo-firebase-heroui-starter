// Created by Kien AI (leejungkiin@gmail.com)
export type ModuleId = 'weather' | 'entertainment' | 'management' | 'ai-tools' | 'saas' | 'database-example' | 'analytics-example' | 'ai-example' | 'ui-components-example' | 'todo-app' | 'chat-app' | 'ai-assistant' | 'ecommerce' | 'dev-tools' | 'notification-example';

export interface ModuleRoute {
  path: string;
  title: string;
}

export interface ModuleDefinition {
  id: ModuleId;
  title: string;
  icon?: string;
  routes: ModuleRoute[];
  permissions?: string[];
  dependencies?: ModuleId[];
}
