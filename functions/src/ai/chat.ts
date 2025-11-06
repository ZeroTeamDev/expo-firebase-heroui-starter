import type { Request, Response } from "express";
import { authMiddleware, withCors } from "../core/middleware";
import { sendError } from "../core/errors";
import { ChatSchema, parseBody } from "../core/validation";
import { rateLimit } from "../config/rate-limit";

export const onChat = withCors(async (req: Request, res: Response) => {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    await new Promise<void>((resolve, reject) =>
      authMiddleware(req, res, (err?: any) => (err ? reject(err) : resolve()))
    ).catch(() => res.status(401).json({ error: "Unauthorized" }));
    if (res.headersSent) return;

    const { stream } = parseBody(req, ChatSchema);

    const uid = (req as any).user?.uid || "anon";
    const ip = (req.headers["x-forwarded-for"] as string) || req.ip || "ip";
    const key = `chat:${uid}:${ip}`;
    if (!rateLimit(key, { capacity: 10, refillPerSec: 0.5 })) {
      return res.status(429).json({ error: "Rate limit exceeded" });
    }

    if (stream) {
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("Transfer-Encoding", "chunked");
      const chunks = [
        JSON.stringify({ delta: "Hello " }) + "\n",
        JSON.stringify({ delta: "from " }) + "\n",
        JSON.stringify({ delta: "AI stub" }) + "\n",
        JSON.stringify({ done: true }) + "\n",
      ];
      for (const c of chunks) {
        res.write(c);
      }
      res.end();
      return;
    }

    return res.json({ id: Date.now().toString(), message: { role: "assistant", content: "Hello from AI stub" } });
  } catch (err) {
    return sendError(res, err);
  }
});


