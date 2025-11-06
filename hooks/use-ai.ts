// Created by Kien AI (leejungkiin@gmail.com)
import { useCallback, useState } from 'react';
import { streamChat } from '../services/ai/client';
import type { AIChatRequest } from '../services/ai/types';

export function useAI() {
  const [isStreaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startChat = useCallback(async (req: AIChatRequest, onChunk: (text: string) => void) => {
    setStreaming(true);
    setError(null);
    try {
      for await (const chunk of streamChat(req)) {
        if (chunk.content) onChunk(chunk.content);
      }
    } catch (e: any) {
      setError(e?.message ?? 'Unknown error');
    } finally {
      setStreaming(false);
    }
  }, []);

  return { isStreaming, error, startChat };
}
