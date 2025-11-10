// Created by Kien AI (leejungkiin@gmail.com)
import type { ModuleId } from './types';

// Map module IDs to IconSymbol names (SF Symbols keys used by IconSymbol)
export function getDefaultModuleIcon(id: ModuleId): string {
  const iconMap: Record<ModuleId, string> = {
    weather: 'sun.max.fill',
    entertainment: 'music.note.list',
    management: 'clock',
    'ai-tools': 'chevron.left.forwardslash.chevron.right',
    saas: 'trending-up',
    'database-example': 'externaldrive.fill',
    'analytics-example': 'chart.bar.fill',
    'ai-example': 'sparkles',
  };
  return iconMap[id] || 'square.fill';
}


