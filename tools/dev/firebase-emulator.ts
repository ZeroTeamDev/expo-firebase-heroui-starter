/**
 * Firebase Emulator Launcher
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Utility to launch Firebase emulators for local development
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface EmulatorConfig {
  auth?: boolean;
  firestore?: boolean;
  functions?: boolean;
  storage?: boolean;
  database?: boolean;
  hosting?: boolean;
  pubsub?: boolean;
  port?: {
    auth?: number;
    firestore?: number;
    functions?: number;
    storage?: number;
    database?: number;
    hosting?: number;
    pubsub?: number;
  };
}

export async function startEmulators(config: EmulatorConfig = {}) {
  const defaultConfig: EmulatorConfig = {
    auth: true,
    firestore: true,
    functions: false,
    storage: false,
    database: false,
    hosting: false,
    pubsub: false,
    port: {
      auth: 9099,
      firestore: 8080,
      functions: 5001,
      storage: 9199,
      database: 9000,
      hosting: 5000,
      pubsub: 8085,
    },
  };

  const finalConfig = { ...defaultConfig, ...config };

  const emulators: string[] = [];
  if (finalConfig.auth) emulators.push('auth');
  if (finalConfig.firestore) emulators.push('firestore');
  if (finalConfig.functions) emulators.push('functions');
  if (finalConfig.storage) emulators.push('storage');
  if (finalConfig.database) emulators.push('database');
  if (finalConfig.hosting) emulators.push('hosting');
  if (finalConfig.pubsub) emulators.push('pubsub');

  if (emulators.length === 0) {
    throw new Error('No emulators specified');
  }

  const emulatorList = emulators.join(',');
  
  try {
    console.log(`Starting Firebase emulators: ${emulatorList}`);
    const { stdout, stderr } = await execAsync(`firebase emulators:start --only ${emulatorList}`);
    console.log(stdout);
    if (stderr) console.error(stderr);
  } catch (error: any) {
    console.error('Error starting emulators:', error.message);
    throw error;
  }
}

export async function stopEmulators() {
  try {
    console.log('Stopping Firebase emulators...');
    await execAsync('firebase emulators:stop');
    console.log('Emulators stopped');
  } catch (error: any) {
    console.error('Error stopping emulators:', error.message);
    throw error;
  }
}

export async function checkEmulatorStatus(): Promise<boolean> {
  try {
    // Check if emulators are running by trying to connect to UI
    const { stdout } = await execAsync('curl -s http://localhost:4000');
    return stdout.includes('Firebase Emulator Suite');
  } catch {
    return false;
  }
}

