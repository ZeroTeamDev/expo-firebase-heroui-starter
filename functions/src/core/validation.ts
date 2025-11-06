import { z } from "zod";
import type { Request } from "express";
import { HttpError } from "./errors";

export function parseBody<T>(req: Request, schema: z.ZodSchema<T>): T {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    throw new HttpError(400, "Invalid request body", "bad_request", result.error.flatten());
  }
  return result.data;
}

export const ChatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["system", "user", "assistant"]),
        content: z.string().min(1),
      })
    )
    .min(1),
  model: z.string().optional(),
  conversationId: z.string().optional(),
  stream: z.boolean().optional(),
});

export const VisionSchema = z.object({
  imageUrl: z.string().url().optional(),
  imageBase64: z.string().optional(),
  prompt: z.string().optional(),
  model: z.string().optional(),
}).refine((d) => Boolean(d.imageUrl || d.imageBase64), {
  message: "imageUrl or imageBase64 required",
});

export const SpeechSchema = z.object({
  audioUrl: z.string().url().optional(),
  audioBase64: z.string().optional(),
  language: z.string().optional(),
}).refine((d) => Boolean(d.audioUrl || d.audioBase64), {
  message: "audioUrl or audioBase64 required",
});


