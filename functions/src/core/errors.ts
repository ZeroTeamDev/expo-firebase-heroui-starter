// Created by Kien AI (leejungkiin@gmail.com)
export class HttpError extends Error { constructor(public status: number, message: string) { super(message); } }
