/**
 * Table Selection Utilities
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Utilities for managing table row selection state
 */

export interface SelectionState<T> {
  selectedIds: Set<string>;
  allSelected: boolean;
  indeterminate: boolean;
}

export function createSelectionState<T extends { id: string }>(items: T[]): SelectionState<T> {
  return {
    selectedIds: new Set<string>(),
    allSelected: false,
    indeterminate: false,
  };
}

export function toggleSelection<T extends { id: string }>(
  state: SelectionState<T>,
  itemId: string,
  items: T[],
): SelectionState<T> {
  const newSelectedIds = new Set(state.selectedIds);
  
  if (newSelectedIds.has(itemId)) {
    newSelectedIds.delete(itemId);
  } else {
    newSelectedIds.add(itemId);
  }

  const allSelected = newSelectedIds.size === items.length && items.length > 0;
  const indeterminate = newSelectedIds.size > 0 && newSelectedIds.size < items.length;

  return {
    selectedIds: newSelectedIds,
    allSelected,
    indeterminate,
  };
}

export function selectAll<T extends { id: string }>(
  state: SelectionState<T>,
  items: T[],
): SelectionState<T> {
  const newSelectedIds = new Set(items.map((item) => item.id));
  
  return {
    selectedIds: newSelectedIds,
    allSelected: items.length > 0,
    indeterminate: false,
  };
}

export function clearSelection<T extends { id: string }>(): SelectionState<T> {
  return {
    selectedIds: new Set<string>(),
    allSelected: false,
    indeterminate: false,
  };
}

export function getSelectedItems<T extends { id: string }>(
  state: SelectionState<T>,
  items: T[],
): T[] {
  return items.filter((item) => state.selectedIds.has(item.id));
}


