/**
 * AI Conversation Store
 * Created by Kien AI (leejungkiin@gmail.com)
 */

import { create } from "zustand";
import type { AIChatMessage } from "@/services/ai/types";

interface AIState {
  conversationId: string | null;
  messages: AIChatMessage[];
  streaming: boolean;
  error: string | null;
}

interface AIActions {
  setConversationId: (id: string | null) => void;
  addMessage: (msg: AIChatMessage) => void;
  setStreaming: (value: boolean) => void;
  setError: (err: string | null) => void;
  reset: () => void;
}

type AIStore = AIState & AIActions;

export const useAIStore = create<AIStore>((set) => ({
  conversationId: null,
  messages: [],
  streaming: false,
  error: null,

  setConversationId: (id) => set({ conversationId: id }),

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, { ...msg, createdAt: msg.createdAt ?? Date.now() }],
    })),

  setStreaming: (value) => set({ streaming: value }),

  setError: (err) => set({ error: err }),

  reset: () => set({ conversationId: null, messages: [], streaming: false, error: null }),
}));


