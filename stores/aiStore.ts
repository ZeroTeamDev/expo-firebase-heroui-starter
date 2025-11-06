// Created by Kien AI (leejungkiin@gmail.com)
import { create } from 'zustand';

interface Message { id: string; role: 'user' | 'assistant'; content: string }

interface AIState {
  messages: Message[];
  addMessage: (m: Message) => void;
  clear: () => void;
}

export const useAIStore = create<AIState>((set) => ({
  messages: [],
  addMessage: (m) => set((s) => ({ messages: [...s.messages, m] })),
  clear: () => set({ messages: [] }),
}));
