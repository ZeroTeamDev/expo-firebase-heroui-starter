/**
 * AI Store
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Enhanced Zustand store for AI conversation management and usage tracking
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Conversation, ConversationMessage } from '../services/ai/types';

interface AIState {
  // Conversations
  conversations: Map<string, Conversation>;
  currentConversationId: string | null;
  
  // Conversation management
  addConversation: (conversation: Conversation) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  deleteConversation: (id: string) => void;
  getConversation: (id: string) => Conversation | undefined;
  setCurrentConversation: (id: string | null) => void;
  
  // Messages
  addMessage: (conversationId: string, message: ConversationMessage) => void;
  updateMessage: (conversationId: string, messageId: string, message: Partial<ConversationMessage>) => void;
  deleteMessage: (conversationId: string, messageId: string) => void;
  clearConversation: (conversationId: string) => void;
  
  // Usage tracking
  totalTokens: number;
  totalRequests: number;
  rateLimitRemaining: number;
  rateLimitReset: number | null;
  addUsage: (tokens: number) => void;
  setRateLimit: (remaining: number, reset: number) => void;
  
  // Context management
  getContext: (conversationId: string, maxMessages?: number) => string[];
}

// Helper function to ensure conversations is always a Map
function ensureConversationsMap(conversations: any): Map<string, Conversation> {
  // If it's already a Map, return it
  if (conversations instanceof Map) {
    return conversations;
  }
  
  // If it's an array (from persisted state - Array.from(map.entries())),
  // convert back to Map
  if (Array.isArray(conversations)) {
    try {
      // Array should be in format [[key, value], [key, value], ...]
      return new Map(conversations);
    } catch (error) {
      console.warn('[AIStore] Failed to convert array to Map:', error);
      return new Map();
    }
  }
  
  // If it's an object (shouldn't happen, but handle it anyway),
  // convert to Map
  if (conversations && typeof conversations === 'object' && !Array.isArray(conversations)) {
    try {
      return new Map(Object.entries(conversations));
    } catch (error) {
      console.warn('[AIStore] Failed to convert object to Map:', error);
      return new Map();
    }
  }
  
  // Default to empty Map
  return new Map();
}

export const useAIStore = create<AIState>()(
  persist(
    (set, get) => ({
      // Conversations - ensure it's always a Map
      conversations: new Map(),
      currentConversationId: null,

      // Conversation management
      addConversation: (conversation: Conversation) => {
        set((state) => {
          const conversationsMap = ensureConversationsMap(state.conversations);
          const newConversations = new Map(conversationsMap);
          newConversations.set(conversation.id, conversation);
          return { conversations: newConversations };
        });
      },

      updateConversation: (id: string, updates: Partial<Conversation>) => {
        set((state) => {
          const conversationsMap = ensureConversationsMap(state.conversations);
          const conversation = conversationsMap.get(id);
          if (!conversation) return state;

          const newConversations = new Map(conversationsMap);
          newConversations.set(id, {
            ...conversation,
            ...updates,
            updatedAt: Date.now(),
          });
          return { conversations: newConversations };
        });
      },

      deleteConversation: (id: string) => {
        set((state) => {
          const conversationsMap = ensureConversationsMap(state.conversations);
          const newConversations = new Map(conversationsMap);
          newConversations.delete(id);
          return {
            conversations: newConversations,
            currentConversationId: state.currentConversationId === id ? null : state.currentConversationId,
          };
        });
      },

      getConversation: (id: string) => {
        const conversationsMap = ensureConversationsMap(get().conversations);
        return conversationsMap.get(id);
      },

      setCurrentConversation: (id: string | null) => {
        set({ currentConversationId: id });
      },

      // Messages
      addMessage: (conversationId: string, message: ConversationMessage) => {
        set((state) => {
          const conversationsMap = ensureConversationsMap(state.conversations);
          const conversation = conversationsMap.get(conversationId);
          if (!conversation) {
            // Create new conversation if it doesn't exist
            const newConversation: Conversation = {
              id: conversationId,
              messages: [message],
              createdAt: Date.now(),
              updatedAt: Date.now(),
            };
            const newConversations = new Map(conversationsMap);
            newConversations.set(conversationId, newConversation);
            return { conversations: newConversations };
          }

          const newConversations = new Map(conversationsMap);
          newConversations.set(conversationId, {
            ...conversation,
            messages: [...conversation.messages, message],
            updatedAt: Date.now(),
          });
          return { conversations: newConversations };
        });
      },

      updateMessage: (conversationId: string, messageId: string, updates: Partial<ConversationMessage>) => {
        set((state) => {
          const conversationsMap = ensureConversationsMap(state.conversations);
          const conversation = conversationsMap.get(conversationId);
          if (!conversation) return state;

          const newConversations = new Map(conversationsMap);
          newConversations.set(conversationId, {
            ...conversation,
            messages: conversation.messages.map((msg) =>
              msg.id === messageId ? { ...msg, ...updates } : msg
            ),
            updatedAt: Date.now(),
          });
          return { conversations: newConversations };
        });
      },

      deleteMessage: (conversationId: string, messageId: string) => {
        set((state) => {
          const conversationsMap = ensureConversationsMap(state.conversations);
          const conversation = conversationsMap.get(conversationId);
          if (!conversation) return state;

          const newConversations = new Map(conversationsMap);
          newConversations.set(conversationId, {
            ...conversation,
            messages: conversation.messages.filter((msg) => msg.id !== messageId),
            updatedAt: Date.now(),
          });
          return { conversations: newConversations };
        });
      },

      clearConversation: (conversationId: string) => {
        set((state) => {
          const conversationsMap = ensureConversationsMap(state.conversations);
          const conversation = conversationsMap.get(conversationId);
          if (!conversation) return state;

          const newConversations = new Map(conversationsMap);
          newConversations.set(conversationId, {
            ...conversation,
            messages: [],
            updatedAt: Date.now(),
          });
          return { conversations: newConversations };
        });
      },

      // Usage tracking
      totalTokens: 0,
      totalRequests: 0,
      rateLimitRemaining: 100,
      rateLimitReset: null,

      addUsage: (tokens: number) => {
        set((state) => ({
          totalTokens: state.totalTokens + tokens,
          totalRequests: state.totalRequests + 1,
        }));
      },

      setRateLimit: (remaining: number, reset: number) => {
        set({
          rateLimitRemaining: remaining,
          rateLimitReset: reset,
        });
      },

      // Context management
      getContext: (conversationId: string, maxMessages = 10) => {
        const conversationsMap = ensureConversationsMap(get().conversations);
        const conversation = conversationsMap.get(conversationId);
        if (!conversation) return [];

        const recentMessages = conversation.messages.slice(-maxMessages);
        return recentMessages.map((msg) => `${msg.role}: ${msg.content}`);
      },
    }),
    {
      name: 'ai-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        conversations: Array.from(ensureConversationsMap(state.conversations).entries()),
        currentConversationId: state.currentConversationId,
        totalTokens: state.totalTokens,
        totalRequests: state.totalRequests,
      }),
      merge: (persistedState, currentState) => {
        // Ensure conversations is a Map when merging persisted state
        const persisted = persistedState as any;
        if (persisted && persisted.conversations) {
          persisted.conversations = ensureConversationsMap(persisted.conversations);
        }
        return {
          ...currentState,
          ...persisted,
          conversations: ensureConversationsMap(persisted?.conversations || currentState.conversations),
        };
      },
    }
  )
);
