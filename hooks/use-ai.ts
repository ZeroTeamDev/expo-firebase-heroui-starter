/**
 * AI Hooks
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Enhanced React hooks for AI operations with conversation management
 */

import { useCallback, useState, useEffect, useMemo, useRef } from 'react';
import { streamChat, chat, analyzeImage } from '../services/ai/client';
import { analyzeDocument, analyzeAudio, analyzeVideo } from '../services/ai/document-client';
import { useAIStore } from '../stores/aiStore';
import type {
  AIChatRequest,
  AIVisionRequest,
  AIDocumentRequest,
  AIAudioRequest,
  AIVideoRequest,
  Conversation,
  ConversationMessage,
} from '../services/ai/types';

/**
 * Options for AI hooks
 */
export interface AIHookOptions {
  retryCount?: number;
  retryDelay?: number;
  timeout?: number;
  onError?: (error: Error) => void;
  onSuccess?: (result: any) => void;
}

/**
 * Hook for AI chat with conversation management
 */
export function useAIChat(conversationId?: string, options?: AIHookOptions) {
  const [isStreaming, setStreaming] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentMessage, setCurrentMessage] = useState('');
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>(conversationId);
  
  // Subscribe to conversations Map directly to trigger re-renders when it changes
  // Use a selector that returns the specific conversation's messages array
  // This will trigger re-render when the Map reference changes (which happens on every update)
  const convId = currentConversationId || conversationId;
  
  // Subscribe to the conversations Map - this triggers re-render when Map changes
  const conversations = useAIStore((state) => state.conversations);
  
  // Get messages from the conversation - this will update when conversations Map updates
  const conversation = convId ? conversations.get(convId) : null;
  
  // Memoize messages to prevent unnecessary re-renders and log spam
  // Only create new array reference when conversation messages actually change
  const messages = useMemo(() => {
    return conversation?.messages || [];
  }, [conversation?.messages]);
  
  // Get store actions (these don't need to trigger re-renders)
  const { addConversation, addMessage, updateMessage } = useAIStore();
  
  // Track previous messages to only log when content actually changes
  const prevMessagesRef = useRef<string>('');
  
  // Debug: Log when messages actually change (not on every render)
  useEffect(() => {
    if (__DEV__) {
      // Create a stable key from messages to detect actual changes
      const messagesKey = JSON.stringify(
        messages.map(m => ({ id: m.id, role: m.role, contentLength: m.content?.length || 0 }))
      );
      
      // Only log if messages actually changed
      if (prevMessagesRef.current !== messagesKey) {
        console.log('[useAIChat] Messages updated:', {
          convId,
          messagesCount: messages.length,
          messageContents: messages.map(m => ({ role: m.role, contentLength: m.content?.length || 0 })),
        });
        prevMessagesRef.current = messagesKey;
      }
    }
  }, [messages, convId]);

  const startChat = useCallback(
    async (request: AIChatRequest, onChunk?: (text: string) => void) => {
      setStreaming(true);
      setError(null);
      setCurrentMessage('');

      try {
        const convId = request.conversationId || conversationId || `conv_${Date.now()}`;
        
        // Update current conversation ID so messages are read from the correct conversation
        if (convId !== currentConversationId) {
          setCurrentConversationId(convId);
        }
        
        let assistantMessageId = `msg_${Date.now()}`;
        let fullContent = '';

        // Ensure conversation exists in store
        if (!conversations.get(convId)) {
          addConversation({
            id: convId,
            title: request.message.substring(0, 50) || 'New Conversation',
            messages: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
            context: request.context || [],
          });
        }

        // Add user message
        const userMessage: ConversationMessage = {
          id: `msg_${Date.now()}_user`,
          role: 'user',
          content: request.message,
          timestamp: Date.now(),
        };
        addMessage(convId, userMessage);

        // Create assistant message placeholder
        const assistantMessage: ConversationMessage = {
          id: assistantMessageId,
          role: 'assistant',
          content: '',
          timestamp: Date.now(),
        };
        addMessage(convId, assistantMessage);

        // Stream response
        for await (const chunk of streamChat({ ...request, conversationId: convId }, options)) {
          if (__DEV__) {
            console.log('[useAIChat] Received chunk:', {
              id: chunk.id,
              hasContent: !!chunk.content,
              contentLength: chunk.content?.length || 0,
              done: chunk.done,
              hasError: !!chunk.error,
            });
          }

          if (chunk.error) {
            // Log detailed error information
            console.error('[useAIChat] Chunk error:', {
              error: chunk.error,
              chunkId: chunk.id,
            });
            throw new Error(chunk.error);
          }

          if (chunk.content) {
            fullContent += chunk.content;
            setCurrentMessage(fullContent);
            onChunk?.(chunk.content);

            // Update message in store
            updateMessage(convId, assistantMessageId, {
              ...assistantMessage,
              content: fullContent,
              usage: chunk.usage,
            });

            if (__DEV__) {
              console.log('[useAIChat] Updated message:', {
                convId,
                messageId: assistantMessageId,
                contentLength: fullContent.length,
              });
            }
          }

          if (chunk.done) {
            // Ensure final message is saved even if no content chunks were received
            if (fullContent) {
              updateMessage(convId, assistantMessageId, {
                ...assistantMessage,
                content: fullContent,
                usage: chunk.usage,
              });
              
              if (__DEV__) {
                console.log('[useAIChat] Final message update:', {
                  convId,
                  messageId: assistantMessageId,
                  contentLength: fullContent.length,
                });
                
                // Verify message was saved
                const updatedConversation = conversations.get(convId);
                const savedMessage = updatedConversation?.messages.find(m => m.id === assistantMessageId);
                console.log('[useAIChat] Message verification:', {
                  conversationExists: !!updatedConversation,
                  messageExists: !!savedMessage,
                  messageContentLength: savedMessage?.content?.length || 0,
                  totalMessages: updatedConversation?.messages.length || 0,
                });
              }
            }
            break;
          }
        }

        // Final update to ensure message is saved
        if (fullContent) {
          updateMessage(convId, assistantMessageId, {
            ...assistantMessage,
            content: fullContent,
          });
        }

        // Clear currentMessage after successful completion to avoid showing it twice
        // (it should be in messages array now)
        setCurrentMessage('');

        if (__DEV__) {
          const finalConversation = conversations.get(convId);
          console.log('[useAIChat] Chat completed:', {
            convId,
            fullContentLength: fullContent.length,
            totalMessages: finalConversation?.messages.length || 0,
            messages: finalConversation?.messages.map(m => ({ role: m.role, contentLength: m.content.length })),
          });
        }

        options?.onSuccess?.(fullContent);
        return fullContent;
      } catch (e: any) {
        const error = e as Error;
        
        // Log detailed error information
        console.error('[useAIChat] Error in startChat:', {
          message: error.message,
          stack: error.stack,
          name: error.name,
          code: (e as any).code,
          status: (e as any).status,
          response: (e as any).response,
          requestId: (e as any).requestId,
        });
        
        setError(error);
        options?.onError?.(error);
        throw error;
      } finally {
        setStreaming(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [conversationId, currentConversationId, conversations, addConversation, addMessage, updateMessage]
  );

  const sendMessage = useCallback(
    async (message: string, context?: string[]) => {
      return startChat({
        message,
        conversationId: conversationId || undefined,
        context: context || conversation?.context,
      });
    },
    [conversationId, conversation, startChat]
  );

  const clearConversation = useCallback(() => {
    if (conversationId) {
      // Clear conversation logic
    }
    setCurrentMessage('');
    setError(null);
  }, [conversationId]);

  return {
    messages,
    isStreaming,
    error,
    currentMessage,
    startChat,
    sendMessage,
    clearConversation,
  };
}

/**
 * Hook for AI vision
 */
export function useAIVision(options?: AIHookOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<any>(null);

  const analyze = useCallback(
    async (request: AIVisionRequest) => {
      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const response = await analyzeImage(request, options);
        setResult(response);
        options?.onSuccess?.(response);
        return response;
      } catch (e: any) {
        const error = e as Error;
        setError(error);
        options?.onError?.(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  return { analyze, loading, error, result };
}

/**
 * Hook for AI document analysis
 */
export function useAIDocument(options?: AIHookOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<any>(null);

  const analyze = useCallback(
    async (request: AIDocumentRequest) => {
      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const response = await analyzeDocument(request, options);
        setResult(response);
        options?.onSuccess?.(response);
        return response;
      } catch (e: any) {
        const error = e as Error;
        setError(error);
        options?.onError?.(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  return { analyze, loading, error, result };
}

/**
 * Hook for AI audio analysis
 */
export function useAIAudio(options?: AIHookOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<any>(null);

  const analyze = useCallback(
    async (request: AIAudioRequest) => {
      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const response = await analyzeAudio(request, options);
        setResult(response);
        options?.onSuccess?.(response);
        return response;
      } catch (e: any) {
        const error = e as Error;
        setError(error);
        options?.onError?.(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  return { analyze, loading, error, result };
}

/**
 * Hook for AI video analysis
 */
export function useAIVideo(options?: AIHookOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<any>(null);

  const analyze = useCallback(
    async (request: AIVideoRequest) => {
      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const response = await analyzeVideo(request, options);
        setResult(response);
        options?.onSuccess?.(response);
        return response;
      } catch (e: any) {
        const error = e as Error;
        setError(error);
        options?.onError?.(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  return { analyze, loading, error, result };
}

