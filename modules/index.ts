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

// Side-effect imports to register built-in modules
// These imports call registerModule(...) in each file on load
import './weather';
import './entertainment';
import './management';
import './ai-tools';
import './saas';
