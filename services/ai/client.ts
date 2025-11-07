/**
 * AI Service Client
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Uses Firebase AI Logic SDK with GoogleAIBackend - No API key needed!
 * Firebase automatically manages API key through its proxy service
 */

import type {
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
  AIError,
} from './types';
import { getFirebaseApp } from '@/integrations/firebase.client';
import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai';
import { Platform } from 'react-native';

const DEFAULT_RETRY_COUNT = 3;
const DEFAULT_RETRY_DELAY = 1000;
const DEFAULT_TIMEOUT = 30000;

/**
 * Get Firebase AI instance with GoogleAIBackend
 * Firebase automatically manages API key - no need to pass it!
 */
function getFirebaseAI() {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) {
    throw new Error('Firebase app not initialized. Please ensure Firebase is configured.');
  }
  
  // Initialize Firebase AI Logic with GoogleAIBackend (Gemini Developer API)
  // No API key needed - Firebase manages it automatically!
  const ai = getAI(firebaseApp, { backend: new GoogleAIBackend() });
  return ai;
}

/**
 * Helper function to convert file URI to base64
 * Works for both web (fetch) and React Native (expo-file-system)
 */
async function fileUriToBase64(uri: string): Promise<{ base64: string; mimeType: string }> {
  try {
    if (Platform.OS === 'web') {
      // Web: use fetch
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      
      // Convert to base64
      let base64 = '';
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
      for (let i = 0; i < bytes.length; i += 3) {
        const a = bytes[i];
        const b = bytes[i + 1] || 0;
        const c = bytes[i + 2] || 0;
        const bitmap = (a << 16) | (b << 8) | c;
        base64 += chars.charAt((bitmap >> 18) & 63);
        base64 += chars.charAt((bitmap >> 12) & 63);
        base64 += i + 1 < bytes.length ? chars.charAt((bitmap >> 6) & 63) : '=';
        base64 += i + 2 < bytes.length ? chars.charAt(bitmap & 63) : '=';
      }
      
      const mimeType = response.headers.get('content-type') || 'application/octet-stream';
      return { base64, mimeType };
    } else {
      // React Native: use expo-file-system
      // Dynamic import to avoid errors if package not installed
      const FileSystem = require('expo-file-system');
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // Try to detect mime type from URI extension
      const extension = uri.split('.').pop()?.toLowerCase();
      const mimeTypes: Record<string, string> = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'webp': 'image/webp',
        'pdf': 'application/pdf',
        'mp3': 'audio/mpeg',
        'wav': 'audio/wav',
        'mp4': 'video/mp4',
        'mov': 'video/quicktime',
      };
      const mimeType = mimeTypes[extension || ''] || 'application/octet-stream';
      
      return { base64, mimeType };
    }
  } catch (error: any) {
    throw new Error(`Failed to convert file to base64: ${error.message}`);
  }
}

/**
 * Retry operation with exponential backoff
 */
async function retryOperation<T>(
  operation: () => Promise<T>,
  retryCount = DEFAULT_RETRY_COUNT,
  retryDelay = DEFAULT_RETRY_DELAY
): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i < retryCount; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      const aiError = error as AIError;
      
      // Don't retry if not retryable
      if (aiError.retryable === false) {
        throw error;
      }

      // Handle rate limiting
      if (aiError.rateLimit) {
        await new Promise((resolve) =>
          setTimeout(resolve, aiError.rateLimit!.retryAfter * 1000)
        );
        continue;
      }

      if (i < retryCount - 1) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay * Math.pow(2, i)));
      }
    }
  }

  throw lastError || new Error('Operation failed after retries');
}

/**
 * Retry async generator operation with exponential backoff
 */
async function* retryAsyncGenerator<T>(
  operation: () => AsyncGenerator<T, void, unknown>,
  retryCount = DEFAULT_RETRY_COUNT,
  retryDelay = DEFAULT_RETRY_DELAY
): AsyncGenerator<T, void, unknown> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retryCount; attempt++) {
    try {
      // Create a new async generator for this attempt
      const generator = operation();
      
      // Iterate through the generator and yield all values
      while (true) {
        const result = await generator.next();
        
        if (result.done) {
          // Generator completed successfully
          return;
        }
        
        // Yield the value
        yield result.value;
      }
    } catch (error) {
      lastError = error as Error;
      const aiError = error as AIError;
      
      // Don't retry if not retryable
      if (aiError.retryable === false) {
        throw error;
      }

      // Handle rate limiting
      if (aiError.rateLimit) {
        await new Promise((resolve) =>
          setTimeout(resolve, aiError.rateLimit!.retryAfter * 1000)
        );
        continue;
      }

      // If this is not the last attempt, wait before retrying
      if (attempt < retryCount - 1) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
      }
    }
  }

  // If all retries failed, throw the last error
  throw lastError || new Error('Operation failed after retries');
}


/**
 * Stream chat using Firebase AI Logic SDK
 * No API key needed - Firebase manages it automatically!
 * 
 * Note: React Native doesn't fully support ReadableStream/pipeThrough,
 * so we fallback to non-streaming mode on React Native
 */
export async function* streamChat(
  request: AIChatRequest,
  options?: { retryCount?: number; retryDelay?: number; timeout?: number }
): AsyncGenerator<AIChatChunk, void, unknown> {
  // React Native doesn't support ReadableStream/pipeThrough - use non-streaming fallback
  if (Platform.OS !== 'web') {
    if (__DEV__) {
      console.log('[AI] React Native detected, using non-streaming fallback');
    }
    
    try {
      const response = await chat(request, options);
      // Simulate streaming by yielding the full response
      yield {
        id: 'response',
        content: response.message,
        done: true,
      };
      return;
    } catch (error: any) {
      if (__DEV__) {
        console.error('[AI] Non-streaming fallback error:', error);
      }
      yield {
        id: 'error',
        content: '',
        done: true,
        error: error.message || 'Chat failed',
      };
      return;
    }
  }

  const operation = async function* () {
    try {
      const ai = getFirebaseAI();
      const model = getGenerativeModel(ai, { 
        model: request.model || 'gemini-2.5-flash' 
      });

      if (__DEV__) {
        console.log('[AI] Starting streaming chat with Firebase AI Logic SDK');
      }

      // Build conversation history if context is provided
      const history = request.context?.map((ctx) => {
        const [role, ...contentParts] = ctx.split(':');
        const content = contentParts.join(':').trim();
        return {
          role: role.trim() === 'user' ? 'user' : 'model',
          parts: [{ text: content }],
        };
      }) || [];

      // Start chat session if we have history
      let chatSession;
      if (history.length > 0) {
        chatSession = model.startChat({ history: history as any });
      }

      // Generate content stream
      // Firebase AI Logic SDK returns async iterable directly for web SDK
      let streamResult;
      try {
        if (chatSession) {
          streamResult = chatSession.sendMessageStream(request.message);
        } else {
          streamResult = model.generateContentStream(request.message);
        }

        if (__DEV__) {
          console.log('[AI] Stream result:', {
            type: typeof streamResult,
            isPromise: streamResult instanceof Promise,
            hasStream: !!(streamResult as any)?.stream,
            hasSymbolAsyncIterator: streamResult ? typeof (streamResult as any)[Symbol.asyncIterator] : 'N/A',
            keys: streamResult && typeof streamResult === 'object' ? Object.keys(streamResult) : [],
          });
        }
      } catch (streamError: any) {
        if (__DEV__) {
          console.error('[AI] Error getting stream:', streamError);
        }
        throw streamError;
      }

      // Handle Promise case (if SDK returns Promise)
      if (streamResult instanceof Promise) {
        if (__DEV__) {
          console.log('[AI] Stream result is a Promise, awaiting...');
        }
        try {
          streamResult = await streamResult;
          
          // Log after await to see the resolved structure
          if (__DEV__) {
            console.log('[AI] Stream result after await:', {
              type: typeof streamResult,
              isPromise: streamResult instanceof Promise,
              hasStream: !!(streamResult as any)?.stream,
              hasResponse: !!(streamResult as any)?.response,
              hasSymbolAsyncIterator: streamResult ? typeof (streamResult as any)[Symbol.asyncIterator] : 'N/A',
              keys: streamResult && typeof streamResult === 'object' ? Object.keys(streamResult) : [],
              constructor: streamResult?.constructor?.name,
              // Check for common Firebase AI SDK properties
              hasStreamMethod: typeof (streamResult as any)?.stream === 'function',
              hasTextMethod: typeof (streamResult as any)?.text === 'function',
            });
          }
        } catch (promiseError: any) {
          if (__DEV__) {
            console.error('[AI] Error awaiting stream Promise:', promiseError);
          }
          throw promiseError;
        }
      }

      // React Native doesn't fully support ReadableStream/pipeThrough
      // Firebase AI Logic SDK may return a response object that needs different handling
      // Try to get the stream or response appropriately
      
      let stream: any = null;
      
      // Check various possible structures from Firebase AI Logic SDK
      if (streamResult && typeof streamResult === 'object') {
        // Check if it's a response object with a .stream method
        if (typeof (streamResult as any).stream === 'function') {
          if (__DEV__) {
            console.log('[AI] Found .stream() method, calling it...');
          }
          try {
            stream = (streamResult as any).stream();
            // If it returns a Promise, await it
            if (stream instanceof Promise) {
              stream = await stream;
            }
          } catch (streamError: any) {
            if (__DEV__) {
              console.error('[AI] Error calling .stream() method:', streamError);
            }
            // Fallback: Try to use response directly
            if ((streamResult as any).response) {
              if (__DEV__) {
                console.log('[AI] Falling back to non-streaming response');
              }
              const responseText = (streamResult as any).response.text();
              yield {
                id: 'response',
                content: responseText,
                done: true,
              };
              return;
            }
            throw streamError;
          }
        } 
        // Check if it has a .response property (non-streaming response)
        else if ((streamResult as any).response) {
          if (__DEV__) {
            console.log('[AI] Found .response property (non-streaming)');
          }
          const responseText = (streamResult as any).response.text();
          yield {
            id: 'response',
            content: responseText,
            done: true,
          };
          return;
        }
        // Check if it's directly iterable
        else if (typeof (streamResult as any)[Symbol.asyncIterator] === 'function') {
          if (__DEV__) {
            console.log('[AI] Stream result is directly async iterable');
          }
          stream = streamResult;
        }
        // Check if it has a .stream property (not a function)
        else if ((streamResult as any).stream !== undefined) {
          if (__DEV__) {
            console.log('[AI] Found .stream property (not a function)');
          }
          stream = (streamResult as any).stream;
          if (stream instanceof Promise) {
            stream = await stream;
          }
        }
      } else {
        // streamResult itself might be the stream
        stream = streamResult;
      }

      let fullContent = '';
      let chunkId = 0;

      // Check if stream is actually iterable
      if (!stream || typeof stream[Symbol.asyncIterator] !== 'function') {
        // Log detailed information for debugging
        if (__DEV__) {
          console.error('[AI] Stream is not async iterable:', {
            streamResultType: typeof streamResult,
            streamType: typeof stream,
            streamResultKeys: streamResult && typeof streamResult === 'object' ? Object.keys(streamResult) : [],
            streamKeys: stream && typeof stream === 'object' ? Object.keys(stream) : [],
            hasStreamProperty: !!(streamResult as any)?.stream,
            hasSymbolAsyncIterator: stream ? typeof stream[Symbol.asyncIterator] : 'N/A',
            streamResultConstructor: streamResult?.constructor?.name,
            streamConstructor: stream?.constructor?.name,
          });
        }
        
        throw new Error(
          'Stream is not async iterable. Firebase AI Logic SDK may have changed its API. ' +
          `Received type: ${typeof stream}, has stream property: ${!!(streamResult as any)?.stream}. ` +
          `StreamResult type: ${typeof streamResult}, Stream type: ${typeof stream}. ` +
          'Please check Firebase AI Logic SDK documentation for the correct usage.'
        );
      }

      for await (const chunk of stream) {
        // Handle different chunk formats
        let chunkText = '';
        if (typeof chunk === 'string') {
          chunkText = chunk;
        } else if (chunk && typeof chunk === 'object') {
          // Try common methods: text(), text, content, content()
          if (typeof chunk.text === 'function') {
            chunkText = chunk.text();
          } else if (typeof chunk.text === 'string') {
            chunkText = chunk.text;
          } else if (typeof chunk.content === 'function') {
            chunkText = chunk.content();
          } else if (typeof chunk.content === 'string') {
            chunkText = chunk.content;
          } else if (chunk.candidates && Array.isArray(chunk.candidates) && chunk.candidates.length > 0) {
            // Gemini format: chunk.candidates[0].content.parts[0].text
            const candidate = chunk.candidates[0];
            if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
              chunkText = candidate.content.parts[0].text || '';
            }
          }
        }
        
        if (chunkText) {
          fullContent += chunkText;
          yield {
            id: `chunk_${chunkId++}`,
            content: chunkText,
            done: false,
          };
        }
      }

      // Final chunk with usage info if available
      yield {
        id: 'final',
        content: '',
        done: true,
        usage: undefined, // Firebase AI Logic SDK may not expose usage directly
      };
    } catch (error: any) {
      if (__DEV__) {
        console.error('[AI] Streaming chat error:', error);
      }
      
      // Check if it's a pipeThrough/ReadableStream error (React Native compatibility issue)
      if (error.message && (error.message.includes('pipeThrough') || error.message.includes('ReadableStream'))) {
        if (__DEV__) {
          console.warn('[AI] ReadableStream/pipeThrough not supported, falling back to non-streaming');
        }
        
        // Fallback to non-streaming chat
        try {
          const response = await chat(request, options);
          yield {
            id: 'fallback',
            content: response.message,
            done: true,
          };
          return;
        } catch (fallbackError: any) {
          if (__DEV__) {
            console.error('[AI] Fallback to non-streaming also failed:', fallbackError);
          }
          const aiError: AIError = {
            code: fallbackError.code || 'UNKNOWN_ERROR',
            message: fallbackError.message || 'Chat failed (streaming and non-streaming both failed)',
            retryable: fallbackError.status >= 500 || fallbackError.status === 429,
          };
          yield {
            id: 'error',
            content: '',
            done: true,
            error: aiError.message,
          };
          return;
        }
      }
      
      const aiError: AIError = {
        code: error.code || 'UNKNOWN_ERROR',
        message: error.message || 'Streaming chat failed',
        retryable: error.status >= 500 || error.status === 429,
      };
      
      yield {
        id: 'error',
        content: '',
        done: true,
        error: aiError.message,
      };
    }
  };

  try {
    yield* retryAsyncGenerator(operation, options?.retryCount, options?.retryDelay);
  } catch (error) {
    const aiError = error as AIError;
    yield {
      id: Date.now().toString(),
      content: '',
      done: true,
      error: aiError.message || 'Streaming chat failed',
    };
  }
}

/**
 * Chat (non-streaming) using Firebase AI Logic SDK
 * No API key needed - Firebase manages it automatically!
 */
export async function chat(
  request: AIChatRequest,
  options?: { retryCount?: number; retryDelay?: number; timeout?: number }
): Promise<AIChatResponse> {
  return retryOperation(async () => {
    try {
      const ai = getFirebaseAI();
      const model = getGenerativeModel(ai, { 
        model: request.model || 'gemini-2.5-flash' 
      });

      if (__DEV__) {
        console.log('[AI] Making non-streaming chat request with Firebase AI Logic SDK');
      }

      // Build conversation history if context is provided
      const history = request.context?.map((ctx) => {
        const [role, ...contentParts] = ctx.split(':');
        const content = contentParts.join(':').trim();
        return {
          role: role.trim() === 'user' ? 'user' : 'model',
          parts: [{ text: content }],
        };
      }) || [];

      // Start chat session if we have history
      let response;
      if (history.length > 0) {
        const chatSession = model.startChat({ history: history as any });
        response = await chatSession.sendMessage(request.message);
      } else {
        response = await model.generateContent(request.message);
      }

      const responseText = response.response.text();
      const conversationId = request.conversationId || `conv_${Date.now()}`;

      if (__DEV__) {
        console.log('[AI] Chat response received:', {
          contentLength: responseText?.length || 0,
        });
      }

      return {
        id: conversationId,
        message: responseText,
        conversationId,
        usage: undefined, // Firebase AI Logic SDK may not expose usage directly
      } as AIChatResponse;
    } catch (error: any) {
      if (__DEV__) {
        console.error('[AI] Chat error:', error);
      }

      const aiError: AIError = {
        code: error.code || 'UNKNOWN_ERROR',
        message: error.message || 'Chat failed',
        retryable: error.status >= 500 || error.status === 429,
      };
      throw aiError;
    }
  }, options?.retryCount, options?.retryDelay);
}

/**
 * Vision analysis using Firebase AI Logic SDK
 * No API key needed - Firebase manages it automatically!
 */
export async function analyzeImage(
  request: AIVisionRequest,
  options?: { retryCount?: number; retryDelay?: number; timeout?: number }
): Promise<AIVisionResponse> {
  return retryOperation(async () => {
    try {
      const ai = getFirebaseAI();
      const model = getGenerativeModel(ai, { 
        model: request.model || 'gemini-2.5-flash' 
      });

      if (__DEV__) {
        console.log('[AI] Analyzing image with Firebase AI Logic SDK');
      }

      // Prepare image parts
      const parts: any[] = [{ text: request.prompt }];

      if (request.imageUrl) {
        // Fetch image and convert to base64
        try {
          const imageResponse = await fetch(request.imageUrl);
          if (!imageResponse.ok) {
            throw new Error(`Failed to fetch image: ${imageResponse.status} ${imageResponse.statusText}`);
          }
          
          const arrayBuffer = await imageResponse.arrayBuffer();
          const bytes = new Uint8Array(arrayBuffer);
          
          // Convert to base64 - simple approach that works on both web and React Native
          let base64 = '';
          const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
          for (let i = 0; i < bytes.length; i += 3) {
            const a = bytes[i];
            const b = bytes[i + 1] || 0;
            const c = bytes[i + 2] || 0;
            const bitmap = (a << 16) | (b << 8) | c;
            base64 += chars.charAt((bitmap >> 18) & 63);
            base64 += chars.charAt((bitmap >> 12) & 63);
            base64 += i + 1 < bytes.length ? chars.charAt((bitmap >> 6) & 63) : '=';
            base64 += i + 2 < bytes.length ? chars.charAt(bitmap & 63) : '=';
          }
          
          const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
          
          parts.push({
            inlineData: {
              data: base64,
              mimeType: contentType,
            },
          });
        } catch (fetchError: any) {
          throw new Error(`Failed to process image from URL: ${fetchError.message}`);
        }
      } else if (request.imageUri) {
        // React Native file picker - use helper from document-client
        try {
          // Dynamic import to avoid circular dependency
          const { fileUriToBase64 } = await import('./document-client');
          const { base64, mimeType } = await fileUriToBase64(request.imageUri);
          parts.push({
            inlineData: {
              data: base64,
              mimeType: mimeType,
            },
          });
        } catch (error: any) {
          throw new Error(`Failed to process image from URI: ${error.message}`);
        }
      } else if (request.imageBase64) {
        parts.push({
          inlineData: {
            data: request.imageBase64,
            mimeType: 'image/jpeg', // Default, could be passed as parameter
          },
        });
      } else {
        throw new Error('Either imageUrl, imageBase64, or imageUri must be provided');
      }

      const response = await model.generateContent(parts);

      const description = response.response.text();

      if (__DEV__) {
        console.log('[AI] Vision analysis completed:', {
          descriptionLength: description?.length || 0,
        });
      }

      return {
        description,
        usage: undefined, // Firebase AI Logic SDK may not expose usage directly
      };
    } catch (error: any) {
      if (__DEV__) {
        console.error('[AI] Vision analysis error:', error);
      }

      const aiError: AIError = {
        code: error.code || 'UNKNOWN_ERROR',
        message: error.message || 'Vision analysis failed',
        retryable: error.status >= 500 || error.status === 429,
      };
      throw aiError;
    }
  }, options?.retryCount, options?.retryDelay);
}
