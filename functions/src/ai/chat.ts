import type { Request, Response } from "express";
import { authMiddleware, withCors } from "../core/middleware";

export const onChat = withCors(async (req: Request, res: Response) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  await new Promise<void>((resolve, reject) =>
    authMiddleware(req, res, (err?: any) => (err ? reject(err) : resolve()))
  ).catch(() => res.status(401).json({ error: "Unauthorized" }));
  if (res.headersSent) return;

  const { messages, stream } = req.body || {};
  if (!Array.isArray(messages)) return res.status(400).json({ error: "Invalid payload" });

  if (stream) {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    const chunks = ["Hello ", "from ", "AI ", "stub!\n", JSON.stringify({ done: true }) + "\n"];
    for (const c of chunks) {
      res.write(c);
    }
    res.end();
    return;
  }

  return res.json({ id: Date.now().toString(), message: { role: "assistant", content: "Hello from AI stub" } });
});


