#!/usr/bin/env node
/**
 * CLI Tool Runner
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Main entry point for CLI generators
 */

import * as fs from 'fs';
import * as path from 'path';
import { generateModule } from './generate-module';
import { generateComponent } from './generate-component';
import { generateService } from './generate-service';
import { generateScreen } from './generate-screen';

const COMMANDS = {
  module: generateModule,
  component: generateComponent,
  service: generateService,
  screen: generateScreen,
} as const;

type Command = keyof typeof COMMANDS;

function printUsage() {
  console.log(`
Usage: npm run cli <command> [options]

Commands:
  module <name>      Generate a new module
  component <name>   Generate a new component
  service <name>     Generate a new service
  screen <name>      Generate a new screen

Examples:
  npm run cli module my-feature
  npm run cli component Button --category ui
  npm run cli service auth
  npm run cli screen Login --category auth
`);
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    printUsage();
    process.exit(1);
  }

  const command = args[0] as Command;
  const name = args[1];
  const options: Record<string, string> = {};

  // Parse options
  for (let i = 2; i < args.length; i += 2) {
    const key = args[i]?.replace(/^--/, '');
    const value = args[i + 1];
    if (key && value) {
      options[key] = value;
    }
  }

  if (!COMMANDS[command]) {
    console.error(`Unknown command: ${command}`);
    printUsage();
    process.exit(1);
  }

  if (!name) {
    console.error(`Missing name for command: ${command}`);
    printUsage();
    process.exit(1);
  }

  try {
    await COMMANDS[command](name, options);
    console.log(`✅ Successfully generated ${command}: ${name}`);
  } catch (error) {
    console.error(`❌ Error generating ${command}:`, error);
    process.exit(1);
  }
}

main();

