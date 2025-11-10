/**
 * AI Service Abstraction
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Unified AI service interface
 */

// Re-export all AI client functions
export {
  streamChat,
  chat,
  analyzeImage,
} from './client';

// Re-export document, audio, video analysis functions
export {
  analyzeDocument,
  analyzeAudio,
  analyzeVideo,
} from './document-client';

// Re-export types
export type {
  AIChatRequest,
  AIChatChunk,
  AIChatResponse,
  AIVisionRequest,
  AIVisionResponse,
  AIDocumentRequest,
  AIDocumentResponse,
  AIAudioRequest,
  AIAudioResponse,
  AIVideoRequest,
  AIVideoResponse,
  Conversation,
  ConversationMessage,
  AIError,
} from './types';

// Re-export hooks
export {
  useAIChat,
  useAIVision,
  useAIDocument,
  useAIAudio,
  useAIVideo,
  type AIHookOptions,
} from '../../hooks/use-ai';

// Re-export store
export { useAIStore } from '../../stores/aiStore';

