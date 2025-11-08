// Created by Kien AI (leejungkiin@gmail.com)
import type { ModuleDefinition, ModuleId } from './types';

const registry = new Map<ModuleId, ModuleDefinition>();

export function registerModule(def: ModuleDefinition) {
  registry.set(def.id, def);
}

export function getModule(id: ModuleId): ModuleDefinition | undefined {
  return registry.get(id);
}

export function listModules(): ModuleDefinition[] {
  return Array.from(registry.values());
}

// Import built-in module definitions and register them explicitly
import weather from './weather';
import entertainment from './entertainment';
import management from './management';
import aiTools from './ai-tools';
import saas from './saas';
import databaseExample from './examples/database-example';
import analyticsExample from './examples/analytics-example';
import aiExample from './examples/ai-example';
import uiComponentsExample from './examples/ui-components-example';
import todoApp from './examples/todo-app';
import chatApp from './examples/chat-app';
import aiAssistant from './examples/ai-assistant';
import ecommerce from './examples/ecommerce';
import devTools from './dev-tools';
import notificationExample from './examples/notification-example';
import bottomSheetExample from './examples/bottom-sheet-example';

registerModule(weather);
registerModule(entertainment);
registerModule(management);
registerModule(aiTools);
registerModule(saas);
registerModule(databaseExample);
registerModule(analyticsExample);
registerModule(aiExample);
registerModule(uiComponentsExample);
registerModule(todoApp);
registerModule(chatApp);
registerModule(aiAssistant);
registerModule(ecommerce);
registerModule(devTools);
registerModule(notificationExample);
registerModule(bottomSheetExample);
