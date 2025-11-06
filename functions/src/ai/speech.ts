// Created by Kien AI (leejungkiin@gmail.com)
import { withMiddleware } from '../core/middleware';

interface SpeechRequest { audioUrl?: string }
interface SpeechResponse { transcript: string }

export const speech = withMiddleware<SpeechRequest, SpeechResponse>(async (_req) => {
  return { transcript: 'Speech placeholder' };
});
