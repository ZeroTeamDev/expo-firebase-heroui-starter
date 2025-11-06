// Created by Kien AI (leejungkiin@gmail.com)
import { withMiddleware } from '../core/middleware';

interface ChatRequest { message: string; conversationId?: string; model?: string }
interface ChatChunk { id: string; content: string; done?: boolean }

export const chat = withMiddleware<ChatRequest, ChatChunk>(async (req) => {
  return { id: 'init', content: `Echo: ${req.message}` };
});
