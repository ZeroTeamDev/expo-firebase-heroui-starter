import type { Request, Response, NextFunction } from "express";
import * as admin from "firebase-admin";

let adminInitialized = false;
function ensureAdmin() {
  if (!adminInitialized) {
    admin.initializeApp();
    adminInitialized = true;
  }
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    ensureAdmin();
    const authHeader = req.header("authorization") || req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing bearer token" });
    }
    const idToken = authHeader.substring(7);
    const decoded = await admin.auth().verifyIdToken(idToken);
    (req as any).user = decoded;
    return next();
  } catch (e: any) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

export function withCors(handler: (req: Request, res: Response) => Promise<void> | void) {
  return async (req: Request, res: Response) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") return res.status(204).end();
    return handler(req, res);
  };
}


