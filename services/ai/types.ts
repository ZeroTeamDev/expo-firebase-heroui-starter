// Created by Kien AI (leejungkiin@gmail.com)
export interface AIChatRequest {
  message: string;
  conversationId?: string;
  model?: string;
}

export interface AIChatChunk {
  id: string;
  content: string;
  done?: boolean;
}
