/**
 * AI Service Types
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Type definitions for AI services
 */

export interface AIChatRequest {
  message: string;
  conversationId?: string;
  model?: string;
  context?: string[];
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface AIChatChunk {
  id: string;
  content: string;
  done?: boolean;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AIChatResponse {
  id: string;
  message: string;
  conversationId: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AIVisionRequest {
  imageUrl?: string;
  imageBase64?: string;
  imageUri?: string; // For React Native file picker
  prompt: string;
  model?: string;
  maxTokens?: number;
}

export interface AIVisionResponse {
  description: string;
  objects?: Array<{
    label: string;
    confidence: number;
    bbox?: [number, number, number, number];
  }>;
  ocr?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AIDocumentRequest {
  documentUrl?: string;
  documentBase64?: string;
  documentUri?: string; // For React Native file picker
  mimeType?: string;
  prompt: string;
  model?: string;
  maxTokens?: number;
}

export interface AIDocumentResponse {
  text: string;
  summary?: string;
  entities?: Array<{
    name: string;
    type: string;
    confidence: number;
  }>;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AIAudioRequest {
  audioUrl?: string;
  audioBase64?: string;
  audioUri?: string; // For React Native file picker
  prompt: string;
  model?: string;
  maxTokens?: number;
}

export interface AIAudioResponse {
  transcript?: string;
  description?: string;
  summary?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AIVideoRequest {
  videoUrl?: string;
  videoBase64?: string;
  videoUri?: string; // For React Native file picker
  prompt: string;
  model?: string;
  maxTokens?: number;
}

export interface AIVideoResponse {
  description: string;
  summary?: string;
  scenes?: Array<{
    description: string;
    timestamp: number;
  }>;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AISpeechRequest {
  audioUrl?: string;
  audioBase64?: string;
  language?: string;
  model?: string;
}

export interface AISpeechResponse {
  transcript: string;
  language?: string;
  confidence?: number;
  segments?: Array<{
    text: string;
    start: number;
    end: number;
  }>;
}

export interface AITTSRequest {
  text: string;
  voice?: string;
  language?: string;
  speed?: number;
  pitch?: number;
}

export interface AITTSResponse {
  audioUrl: string;
  audioBase64?: string;
  duration?: number;
}

export interface AIEmbeddingRequest {
  text: string | string[];
  model?: string;
}

export interface AIEmbeddingResponse {
  embeddings: number[][];
  model: string;
  usage?: {
    promptTokens: number;
    totalTokens: number;
  };
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface Conversation {
  id: string;
  title?: string;
  messages: ConversationMessage[];
  createdAt: number;
  updatedAt: number;
  context?: string[];
}

export interface AIError {
  code: string;
  message: string;
  retryable: boolean;
  rateLimit?: {
    retryAfter: number;
    limit: number;
    remaining: number;
  };
}
