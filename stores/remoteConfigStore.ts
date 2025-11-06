// Created by Kien AI (leejungkiin@gmail.com)
import { create } from 'zustand';
import type { FeatureFlags } from '../services/remote-config/types';

interface RemoteConfigState {
  flags: FeatureFlags | null;
  setFlags: (f: FeatureFlags | null) => void;
  updateFlags: (f: FeatureFlags) => void;
}

export const useRemoteConfigStore = create<RemoteConfigState>((set) => ({
  flags: null,
  setFlags: (f) => set({ flags: f }),
  updateFlags: (f) => set({ flags: f }),
}));
