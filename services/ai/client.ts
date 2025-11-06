// Created by Kien AI (leejungkiin@gmail.com)
import type { AIChatRequest, AIChatChunk } from './types';

export async function* streamChat(request: AIChatRequest): AsyncGenerator<AIChatChunk, void, unknown> {
  const res = await fetch('/functions/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!res.ok || !res.body) throw new Error('Failed to start AI stream');

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split('\n');
    buffer = parts.pop() ?? '';
    for (const line of parts) {
      if (!line) continue;
      yield JSON.parse(line) as AIChatChunk;
    }
  }

  if (buffer) {
    try { yield JSON.parse(buffer) as AIChatChunk; } catch {}
  }
}
