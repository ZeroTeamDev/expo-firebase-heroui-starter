// Created by Kien AI (leejungkiin@gmail.com)
export function requireString(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${field} is required`);
  return value;
}
