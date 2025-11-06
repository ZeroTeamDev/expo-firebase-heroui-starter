/**
 * AI Service Types
 * Created by Kien AI (leejungkiin@gmail.com)
 */

export type AIModel =
  | "gpt-4o-mini"
  | "gpt-4o"
  | "gpt-4.1-mini"
  | "gemini-1.5-pro"
  | "llama-3.1-8b"
  | string;

export interface AIChatMessage {
  id?: string;
  role: "system" | "user" | "assistant";
  content: string;
  createdAt?: number;
}

export interface AIChatRequest {
  messages: AIChatMessage[];
  model?: AIModel;
  conversationId?: string;
  stream?: boolean;
}

export interface AIChatChunk {
  id?: string;
  delta?: string;
  done?: boolean;
  error?: string;
}

export interface AIChatResponse {
  id: string;
  message: AIChatMessage;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

export interface AIVisionRequest {
  imageUrl?: string;
  imageBase64?: string;
  prompt?: string;
  model?: AIModel;
}

export interface AIVisionResponse {
  id: string;
  result: string;
  details?: Record<string, any>;
}

export interface AISpeechRequest {
  audioUrl?: string;
  audioBase64?: string;
  language?: string;
}

export interface AISpeechResponse {
  id: string;
  transcript: string;
  confidence?: number;
}

export type StreamHandler = (chunk: AIChatChunk) => void;


