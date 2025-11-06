// Created by Kien AI (leejungkiin@gmail.com)
import type { ModuleId } from './types';

// Map module IDs to IconSymbol names (SF Symbols keys used by IconSymbol)
export function getDefaultModuleIcon(id: ModuleId):
  | 'sun.max.fill'
  | 'music.note.list'
  | 'clock'
  | 'chevron.left.forwardslash.chevron.right'
  | 'trending-up' {
  switch (id) {
    case 'weather':
      return 'sun.max.fill';
    case 'entertainment':
      return 'music.note.list';
    case 'management':
      return 'clock';
    case 'ai-tools':
      return 'chevron.left.forwardslash.chevron.right';
    case 'saas':
      return 'trending-up';
  }
}


