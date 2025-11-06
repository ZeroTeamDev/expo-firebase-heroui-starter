// Created by Kien AI (leejungkiin@gmail.com)
export interface RequestContext { userId?: string }
export function withMiddleware<TReq, TRes>(handler: (req: TReq, ctx: RequestContext) => Promise<TRes>) {
  return async (req: TReq): Promise<TRes> => handler(req, {});
}
