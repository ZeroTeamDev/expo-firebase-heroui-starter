/**
 * AI Service Client
 * Created by Kien AI (leejungkiin@gmail.com)
 */

import { getToken } from "@/integrations/firebase.client";
import type {
  AIChatRequest,
  AIChatResponse,
  AIChatChunk,
  AIVisionRequest,
  AIVisionResponse,
  AISpeechRequest,
  AISpeechResponse,
  StreamHandler,
} from "./types";

const DEFAULT_BASE_URL = process.env.EXPO_PUBLIC_FUNCTIONS_BASE_URL || "";

function buildUrl(path: string): string {
  const base = DEFAULT_BASE_URL.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

async function authHeaders(): Promise<Record<string, string>> {
  const token = await getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export async function aiChat(
  body: AIChatRequest,
  onStream?: StreamHandler
): Promise<AIChatResponse | void> {
  const url = buildUrl("/ai/chat");
  const headers = await authHeaders();

  if (body.stream && onStream) {
    // SSE-like streaming; Functions should send newline-delimited JSON
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    if (!response.ok || !response.body) {
      throw new Error(`AI chat stream failed: ${response.status}`);
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;
    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      if (value) {
        const text = decoder.decode(value, { stream: true });
        const lines = text.split(/\n+/).filter(Boolean);
        for (const line of lines) {
          try {
            const chunk = JSON.parse(line) as AIChatChunk;
            onStream(chunk);
          } catch {
            // ignore malformed lines
          }
        }
      }
    }
    return;
  }

  const resp = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ ...body, stream: false }),
  });
  if (!resp.ok) throw new Error(`AI chat failed: ${resp.status}`);
  return (await resp.json()) as AIChatResponse;
}

export async function aiVision(body: AIVisionRequest): Promise<AIVisionResponse> {
  const url = buildUrl("/ai/vision");
  const resp = await fetch(url, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify(body),
  });
  if (!resp.ok) throw new Error(`AI vision failed: ${resp.status}`);
  return (await resp.json()) as AIVisionResponse;
}

export async function aiSpeech(body: AISpeechRequest): Promise<AISpeechResponse> {
  const url = buildUrl("/ai/speech");
  const resp = await fetch(url, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify(body),
  });
  if (!resp.ok) throw new Error(`AI speech failed: ${resp.status}`);
  return (await resp.json()) as AISpeechResponse;
}


