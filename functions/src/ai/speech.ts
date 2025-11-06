import type { Request, Response } from "express";
import { authMiddleware, withCors } from "../core/middleware";

export const onSpeech = withCors(async (req: Request, res: Response) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  await new Promise<void>((resolve, reject) =>
    authMiddleware(req, res, (err?: any) => (err ? reject(err) : resolve()))
  ).catch(() => res.status(401).json({ error: "Unauthorized" }));
  if (res.headersSent) return;

  const { audioUrl, audioBase64 } = req.body || {};
  if (!audioUrl && !audioBase64) return res.status(400).json({ error: "audio required" });
  return res.json({ id: Date.now().toString(), transcript: "This is a stub transcript" });
});


