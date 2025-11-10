/**
 * AI Document, Audio, Video Analysis Client
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Additional analysis functions for documents, audio, and video
 */

import type {
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

/**
 * Helper function to convert file URI to base64
 * Works for both web (fetch) and React Native (expo-file-system)
 * Exported for use in other modules
 */
export async function fileUriToBase64(uri: string): Promise<{ base64: string; mimeType: string }> {
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
      // React Native: use expo-file-system (with fallback if not available)
      try {
        // Try to use expo-file-system
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
      } catch (fileSystemError: any) {
        // Fallback: try using fetch if expo-file-system is not available
        // This works for file:// URIs and http(s):// URLs
        if (uri.startsWith('file://') || uri.startsWith('http://') || uri.startsWith('https://')) {
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
          const mimeType = mimeTypes[extension || ''] || response.headers.get('content-type') || 'application/octet-stream';
          
          return { base64, mimeType };
        }
        
        // If neither method works, throw the original error
        throw new Error(`Failed to read file: ${fileSystemError.message}. Please ensure expo-file-system is properly installed and the app has been rebuilt.`);
      }
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

  for (let attempt = 0; attempt <= retryCount; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      const aiError = error as AIError;

      if (!aiError.retryable || attempt === retryCount) {
        throw error;
      }

      const delay = retryDelay * Math.pow(2, attempt);
      if (__DEV__) {
        console.warn(`[AI] Retrying operation (attempt ${attempt + 1}/${retryCount}) after ${delay}ms`);
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error('Operation failed after retries');
}

/**
 * Get Firebase AI instance with GoogleAIBackend
 */
function getFirebaseAI() {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) {
    throw new Error('Firebase app not initialized. Please ensure Firebase is configured.');
  }
  
  const ai = getAI(firebaseApp, { backend: new GoogleAIBackend() });
  return ai;
}

/**
 * Document analysis using Firebase AI Logic SDK
 * Supports PDF and other document formats
 */
export async function analyzeDocument(
  request: AIDocumentRequest,
  options?: { retryCount?: number; retryDelay?: number; timeout?: number }
): Promise<AIDocumentResponse> {
  return retryOperation(async () => {
    try {
      const ai = getFirebaseAI();
      const model = getGenerativeModel(ai, { 
        model: request.model || 'gemini-2.5-flash' 
      });

      if (__DEV__) {
        console.log('[AI] Analyzing document with Firebase AI Logic SDK');
      }

      // Prepare document parts
      const parts: any[] = [{ text: request.prompt }];

      if (request.documentUri) {
        const { base64, mimeType } = await fileUriToBase64(request.documentUri);
        parts.push({
          inlineData: {
            data: base64,
            mimeType: request.mimeType || mimeType,
          },
        });
      } else if (request.documentUrl) {
        const { base64, mimeType } = await fileUriToBase64(request.documentUrl);
        parts.push({
          inlineData: {
            data: base64,
            mimeType: request.mimeType || mimeType,
          },
        });
      } else if (request.documentBase64) {
        parts.push({
          inlineData: {
            data: request.documentBase64,
            mimeType: request.mimeType || 'application/pdf',
          },
        });
      } else {
        throw new Error('Either documentUrl, documentBase64, or documentUri must be provided');
      }

      const response = await model.generateContent(parts);
      const text = response.response.text();

      if (__DEV__) {
        console.log('[AI] Document analysis completed:', {
          textLength: text?.length || 0,
        });
      }

      return {
        text,
        usage: undefined,
      };
    } catch (error: any) {
      if (__DEV__) {
        console.error('[AI] Document analysis error:', error);
      }

      const aiError: AIError = {
        code: error.code || 'UNKNOWN_ERROR',
        message: error.message || 'Document analysis failed',
        retryable: error.status >= 500 || error.status === 429,
      };
      throw aiError;
    }
  }, options?.retryCount, options?.retryDelay);
}

/**
 * Audio analysis using Firebase AI Logic SDK
 * Supports MP3, WAV and other audio formats
 */
export async function analyzeAudio(
  request: AIAudioRequest,
  options?: { retryCount?: number; retryDelay?: number; timeout?: number }
): Promise<AIAudioResponse> {
  return retryOperation(async () => {
    try {
      const ai = getFirebaseAI();
      const model = getGenerativeModel(ai, { 
        model: request.model || 'gemini-2.5-flash' 
      });

      if (__DEV__) {
        console.log('[AI] Analyzing audio with Firebase AI Logic SDK');
      }

      // Prepare audio parts
      const parts: any[] = [{ text: request.prompt }];

      if (request.audioUri) {
        const { base64, mimeType } = await fileUriToBase64(request.audioUri);
        parts.push({
          inlineData: {
            data: base64,
            mimeType: mimeType,
          },
        });
      } else if (request.audioUrl) {
        const { base64, mimeType } = await fileUriToBase64(request.audioUrl);
        parts.push({
          inlineData: {
            data: base64,
            mimeType: mimeType,
          },
        });
      } else if (request.audioBase64) {
        parts.push({
          inlineData: {
            data: request.audioBase64,
            mimeType: 'audio/mpeg',
          },
        });
      } else {
        throw new Error('Either audioUrl, audioBase64, or audioUri must be provided');
      }

      const response = await model.generateContent(parts);
      const description = response.response.text();

      if (__DEV__) {
        console.log('[AI] Audio analysis completed:', {
          descriptionLength: description?.length || 0,
        });
      }

      return {
        description,
        usage: undefined,
      };
    } catch (error: any) {
      if (__DEV__) {
        console.error('[AI] Audio analysis error:', error);
      }

      const aiError: AIError = {
        code: error.code || 'UNKNOWN_ERROR',
        message: error.message || 'Audio analysis failed',
        retryable: error.status >= 500 || error.status === 429,
      };
      throw aiError;
    }
  }, options?.retryCount, options?.retryDelay);
}

/**
 * Video analysis using Firebase AI Logic SDK
 * Supports MP4, MOV and other video formats
 */
export async function analyzeVideo(
  request: AIVideoRequest,
  options?: { retryCount?: number; retryDelay?: number; timeout?: number }
): Promise<AIVideoResponse> {
  return retryOperation(async () => {
    try {
      const ai = getFirebaseAI();
      const model = getGenerativeModel(ai, { 
        model: request.model || 'gemini-2.5-flash' 
      });

      if (__DEV__) {
        console.log('[AI] Analyzing video with Firebase AI Logic SDK');
      }

      // Prepare video parts
      const parts: any[] = [{ text: request.prompt }];

      if (request.videoUri) {
        const { base64, mimeType } = await fileUriToBase64(request.videoUri);
        parts.push({
          inlineData: {
            data: base64,
            mimeType: mimeType,
          },
        });
      } else if (request.videoUrl) {
        const { base64, mimeType } = await fileUriToBase64(request.videoUrl);
        parts.push({
          inlineData: {
            data: base64,
            mimeType: mimeType,
          },
        });
      } else if (request.videoBase64) {
        parts.push({
          inlineData: {
            data: request.videoBase64,
            mimeType: 'video/mp4',
          },
        });
      } else {
        throw new Error('Either videoUrl, videoBase64, or videoUri must be provided');
      }

      const response = await model.generateContent(parts);
      const description = response.response.text();

      if (__DEV__) {
        console.log('[AI] Video analysis completed:', {
          descriptionLength: description?.length || 0,
        });
      }

      return {
        description,
        usage: undefined,
      };
    } catch (error: any) {
      if (__DEV__) {
        console.error('[AI] Video analysis error:', error);
      }

      const aiError: AIError = {
        code: error.code || 'UNKNOWN_ERROR',
        message: error.message || 'Video analysis failed',
        retryable: error.status >= 500 || error.status === 429,
      };
      throw aiError;
    }
  }, options?.retryCount, options?.retryDelay);
}
