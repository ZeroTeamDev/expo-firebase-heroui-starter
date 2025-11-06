/**
 * Firebase Functions Client
 * Created by Kien AI (leejungkiin@gmail.com)
 */

import { getToken } from "@/integrations/firebase.client";

const BASE_URL = process.env.EXPO_PUBLIC_FUNCTIONS_BASE_URL || "";

function joinUrl(path: string): string {
  const base = BASE_URL.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

async function withAuth(init?: RequestInit): Promise<RequestInit> {
  const token = await getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return { ...init, headers };
}

export async function callFunction<TReq extends object, TRes = unknown>(
  path: string,
  payload?: TReq,
  init?: RequestInit
): Promise<TRes> {
  const url = joinUrl(path);
  const requestInit = await withAuth({
    method: "POST",
    ...(init || {}),
    body: payload ? JSON.stringify(payload) : undefined,
  });

  const resp = await fetch(url, requestInit);
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Functions call failed (${resp.status}): ${text}`);
  }
  return (await resp.json()) as TRes;
}


