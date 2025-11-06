/**
 * Firebase App Check Setup
 * Created by Kien AI (leejungkiin@gmail.com)
 */

// Note: App Check for Expo RN typically requires native setup. For web builds,
// you can use Firebase JS SDK reCAPTCHA or debug token. This provides a
// placeholder API to keep call sites stable.

export interface AppCheckStatus {
  initialized: boolean;
  provider?: "recaptcha" | "deviceCheck" | "playIntegrity" | "debug" | string;
}

let status: AppCheckStatus = { initialized: false };

export async function initAppCheck(): Promise<AppCheckStatus> {
  // Placeholder no-op to avoid runtime issues in managed workflow
  status = { initialized: true, provider: "debug" };
  return status;
}

export function getAppCheckStatus(): AppCheckStatus {
  return status;
}


