# AI Integration Guide

Created by Kien AI (leejungkiin@gmail.com)

This guide covers both the hook layer (`useAI*`) and the new AI component library that abstracts common UI flows.

## Quick Start

### Conversation UI in 3 steps

```tsx
import { useAIChat } from '@/hooks/use-ai';
import { AIChip, AIConversation } from '@/components/ai';

const conversationId = 'demo-conversation';

export function AIChatExample() {
  const chat = useAIChat(conversationId);

  const handleVoiceComplete = async ({ uri }: { uri: string; duration: number }) => {
    // Optional: transcribe audio before sending
    await chat.startChat({ message: 'Voice input captured', conversationId });
  };

  return (
    <View>
      <AIChip onRecordingComplete={handleVoiceComplete} />
      <AIConversation controller={chat} conversationId={conversationId} />
    </View>
  );
}
```

`AIConversation` renders the full chat timeline, streaming output, prompt input, export/clear controls, and integrates with the Zustand `aiStore` for persistence.

### Vision analysis UI

```tsx
import { AIVision } from '@/components/ai';

export function VisionExample() {
  return <AIVision defaultPrompt="Describe this image in detail" />;
}
```

`AIVision` handles image selection (device or URL), prompt input, loading states, and result rendering.

## Hooks Overview

### useAIChat(conversationId?, options?)
- Streams Gemini responses with automatic conversation persistence
- Exposes `messages`, `isStreaming`, `currentMessage`, `startChat`, `sendMessage`, `clearConversation`
- Supports retry logic via options (`retryCount`, `retryDelay`, `timeout`)

### useAIVision(options?)
- Analyze remote URLs, local URIs, or base64 images
- Returns `{ analyze, loading, error, result }` where `result.description` contains the AI summary

### useAIDocument / useAIAudio / useAIVideo
- Accept URI/URL/Base64 assets with descriptive prompts
- Return `{ description }` strings with the AI summary

### useAIEmbeddings
- `embed` text fragments and `search` in-memory document collections for semantic similarity

> ℹ️ Hooks are exported via `@/services/ai` and re-exported from `@/services` for the unified abstraction layer.

## Component Library

Component exports live in `@/components/ai`.

### AIChip
- Microphone pill with recording state, waveform visualization (Skia), haptics, and permission handling
- Props: `onRecordingComplete`, `onError`, `onStateChange`, `size` (`sm` | `md` | `lg`)

### AIPrompt
- Multiline prompt entry with autocomplete suggestions, history navigation, character counter, and send button
- Props: `onRequestSuggestions`, `suggestions`, `enableHistory`, `clearOnSubmit`

### AIStreaming
- Animated assistant response with typing effect, markdown rendering, copy/regenerate/stop controls
- Props: `text`, `isStreaming`, `usage`, `onCopy`, `onRegenerate`, `onStop`

### AIConversation
- Turn-key conversation surface combining message timeline, prompt input, export/clear actions
- Accepts optional `controller` (from `useAIChat`) for advanced integrations, otherwise instantiates internally

### AIVision
- End-to-end vision workflow: upload, prompt, analyze, copy results
- Supports mobile file pickers and web URL input out of the box

## Best Practices

### 1. Centralize controllers
Instantiate `useAIChat` once per screen and pass the controller to `AIConversation`, background workers, or voice integrations.

### 2. Handle async errors
Provide `onError` callbacks or wrap `startChat`/`analyze` calls in try/catch to surface meaningful feedback.

### 3. Respect streaming state
Disable send actions while `isStreaming` or provide a "Stop" button via `AIStreaming`'s `onStop` handler when you add abort logic.

### 4. Monitor usage
Each stored message may contain `usage.totalTokens`; accumulate these to display session cost estimates.

### 5. Compose components
`AIChip + AIPrompt + AIStreaming` can be rearranged or themed independently thanks to TypeScript props and theming hooks.

## Examples & Reference

- `app/modules/examples/ai-example/index.tsx` showcases the full experience with voice capture, conversation UI, and multimodal samples.
- All components are re-exported via `@/components/ai/index.ts` for single-import ergonomics.
