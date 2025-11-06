// Created by Kien AI (leejungkiin@gmail.com)
export interface CallableOptions {
  signal?: AbortSignal;
}

export async function callFunction<TReq, TRes>(path: string, body: TReq, options: CallableOptions = {}): Promise<TRes> {
  const controller = new AbortController();
  const signal = options.signal ?? controller.signal;
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Function call failed (${res.status}): ${text}`);
  }
  return (await res.json()) as TRes;
}
