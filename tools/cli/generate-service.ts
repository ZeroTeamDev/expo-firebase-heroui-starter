/**
 * Service Generator
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Generates a new service with TypeScript types
 */

import * as fs from 'fs';
import * as path from 'path';

const SERVICE_TEMPLATE = `/**
 * {ServiceName} Service
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * {Description}
 */

// Add your service functions here

export interface {ServiceName}Options {
  // Add your options here
}

export async function {serviceName}(options?: {ServiceName}Options): Promise<void> {
  // Implement your service logic
  console.log('{ServiceName} service called', options);
}

// Export types
export type { {ServiceName}Options };
`;

const SERVICE_INDEX_TEMPLATE = `/**
 * {Category} Services Export
 * Created by Kien AI (leejungkiin@gmail.com)
 */

export * from './{serviceName}';
`;

export async function generateService(name: string, options: Record<string, string>) {
  // Convert name: my-service -> MyService (ServiceName) and myService (serviceName)
  const parts = name.split(/[-_]/);
  const ServiceName = parts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join('');
  const serviceName = parts[0] + parts.slice(1).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join('');

  const category = options.category || 'common';
  const description = options.description || `${ServiceName} service`;

  const serviceDir = path.join(process.cwd(), 'services', category);

  // Create category directory if it doesn't exist
  if (!fs.existsSync(serviceDir)) {
    fs.mkdirSync(serviceDir, { recursive: true });
  }

  // Check if service already exists
  const serviceFile = path.join(serviceDir, `${serviceName}.ts`);
  if (fs.existsSync(serviceFile)) {
    throw new Error(`Service already exists: ${serviceName}`);
  }

  // Generate service file
  const serviceContent = SERVICE_TEMPLATE.replace(/{ServiceName}/g, ServiceName)
    .replace(/{serviceName}/g, serviceName)
    .replace(/{Description}/g, description);
  fs.writeFileSync(serviceFile, serviceContent);

  // Update or create index.ts
  const indexFile = path.join(serviceDir, 'index.ts');
  if (fs.existsSync(indexFile)) {
    let indexContent = fs.readFileSync(indexFile, 'utf-8');
    const exportStatement = `export * from './${serviceName}';`;
    
    if (!indexContent.includes(exportStatement)) {
      // Add export at the end
      indexContent = indexContent.trim() + '\n' + exportStatement + '\n';
      fs.writeFileSync(indexFile, indexContent);
    }
  } else {
    // Create new index.ts
    const indexContent = SERVICE_INDEX_TEMPLATE
      .replace(/{Category}/g, category.charAt(0).toUpperCase() + category.slice(1))
      .replace(/{serviceName}/g, serviceName);
    fs.writeFileSync(indexFile, indexContent);
  }

  // Update root services/index.ts
  const rootIndexFile = path.join(process.cwd(), 'services', 'index.ts');
  if (fs.existsSync(rootIndexFile)) {
    let rootIndex = fs.readFileSync(rootIndexFile, 'utf-8');
    const categoryExport = `export * from './${category}';`;
    
    if (!rootIndex.includes(categoryExport)) {
      // Add export before the last line (if it ends with newline)
      rootIndex = rootIndex.trim() + '\n\n' + categoryExport + '\n';
      fs.writeFileSync(rootIndexFile, rootIndex);
    }
  }

  console.log(`Generated service: ${serviceName}`);
  console.log(`  Location: services/${category}/${serviceName}.ts`);
  console.log(`  Export: services/${category}/index.ts`);
}

