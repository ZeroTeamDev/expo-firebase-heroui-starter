// Created by Kien AI (leejungkiin@gmail.com)
import { useMemo } from 'react';
import { listModules } from '../modules';

export function useModules() {
  return useMemo(() => listModules(), []);
}
