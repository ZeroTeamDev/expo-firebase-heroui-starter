/**
 * AI Hooks
 * Created by Kien AI (leejungkiin@gmail.com)
 */

import { useCallback } from "react";
import { useAIStore } from "@/stores/aiStore";
import { aiChat, aiSpeech, aiVision } from "@/services/ai/client";
import type {
  AIChatMessage,
  AIChatRequest,
  AIVisionRequest,
  AISpeechRequest,
} from "@/services/ai/types";

export function useAI() {
  const messages = useAIStore((s) => s.messages);
  const conversationId = useAIStore((s) => s.conversationId);
  const streaming = useAIStore((s) => s.streaming);
  const error = useAIStore((s) => s.error);

  const setConversationId = useAIStore((s) => s.setConversationId);
  const addMessage = useAIStore((s) => s.addMessage);
  const setStreaming = useAIStore((s) => s.setStreaming);
  const setError = useAIStore((s) => s.setError);
  const reset = useAIStore((s) => s.reset);

  const sendMessage = useCallback(
    async (input: Omit<AIChatMessage, "role"> | string, opts?: Omit<AIChatRequest, "messages">) => {
      const userMsg: AIChatMessage =
        typeof input === "string"
          ? { role: "user", content: input }
          : { role: "user", content: input.content };

      addMessage(userMsg);
      setStreaming(Boolean(opts?.stream));
      setError(null);

      try {
        if (opts?.stream) {
          await aiChat(
            {
              messages: [...messages, userMsg],
              conversationId: conversationId ?? undefined,
              model: opts?.model,
              stream: true,
            },
            (chunk) => {
              if (chunk.error) {
                setError(chunk.error);
              }
              // Stream handler can be wired to UI; for simplicity we append deltas at completion
            }
          );
        } else {
          const resp = await aiChat({
            messages: [...messages, userMsg],
            conversationId: conversationId ?? undefined,
            model: opts?.model,
            stream: false,
          });
          if (resp) {
            setConversationId(resp.id);
            addMessage(resp.message);
          }
        }
      } catch (e: any) {
        setError(e?.message || String(e));
      } finally {
        setStreaming(false);
      }
    },
    [messages, conversationId, addMessage, setStreaming, setError, setConversationId]
  );

  const analyzeImage = useCallback(
    async (req: AIVisionRequest) => {
      setError(null);
      return await aiVision(req);
    },
    [setError]
  );

  const transcribeAudio = useCallback(
    async (req: AISpeechRequest) => {
      setError(null);
      return await aiSpeech(req);
    },
    [setError]
  );

  return {
    messages,
    conversationId,
    streaming,
    error,
    sendMessage,
    analyzeImage,
    transcribeAudio,
    reset,
  };
}


