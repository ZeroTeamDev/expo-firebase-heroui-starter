// Created by Kien AI (leejungkiin@gmail.com)
import { useEffect, useState } from 'react';
import { fetchRemoteConfig } from '../services/remote-config';
import type { FeatureFlags } from '../services/remote-config/types';

export function useRemoteConfig(): FeatureFlags | null {
  const [flags, setFlags] = useState<FeatureFlags | null>(null);
  useEffect(() => {
    fetchRemoteConfig().then(setFlags).catch(() => setFlags(null));
  }, []);
  return flags;
}
