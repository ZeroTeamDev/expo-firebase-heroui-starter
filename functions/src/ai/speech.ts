import type { Request, Response } from "express";
import { authMiddleware, withCors } from "../core/middleware";
import { parseBody, SpeechSchema } from "../core/validation";
import { rateLimit } from "../config/rate-limit";
import { sendError } from "../core/errors";

export const onSpeech = withCors(async (req: Request, res: Response) => {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    await new Promise<void>((resolve, reject) =>
      authMiddleware(req, res, (err?: any) => (err ? reject(err) : resolve()))
    ).catch(() => res.status(401).json({ error: "Unauthorized" }));
    if (res.headersSent) return;

    parseBody(req, SpeechSchema);
    const uid = (req as any).user?.uid || "anon";
    const ip = (req.headers["x-forwarded-for"] as string) || req.ip || "ip";
    const key = `speech:${uid}:${ip}`;
    if (!rateLimit(key, { capacity: 5, refillPerSec: 0.2 })) {
      return res.status(429).json({ error: "Rate limit exceeded" });
    }
    return res.json({ id: Date.now().toString(), transcript: "This is a stub transcript" });
  } catch (err) {
    return sendError(res, err);
  }
});


