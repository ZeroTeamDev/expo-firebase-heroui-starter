// Created by Kien AI (leejungkiin@gmail.com)
import { withMiddleware } from '../core/middleware';

interface VisionRequest { imageUrl?: string; prompt?: string }
interface VisionResponse { summary: string }

export const vision = withMiddleware<VisionRequest, VisionResponse>(async (_req) => {
  return { summary: 'Vision placeholder' };
});
