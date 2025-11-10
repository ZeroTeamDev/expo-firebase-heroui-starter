/**
 * Module Generator
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Generates a new module with definition file
 */

import * as fs from 'fs';
import * as path from 'path';

const MODULE_TEMPLATE = `/**
 * {ModuleTitle} Module
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * {Description}
 */

import type { ModuleDefinition } from '../../types';

const {moduleId}: ModuleDefinition = {
  id: '{moduleId}' as any,
  title: '{ModuleTitle}',
  icon: 'layout-grid',
  routes: [
    {
      path: '/modules/{category}/{moduleId}',
      title: '{ModuleTitle}',
    },
  ],
};

export default {moduleId};
`;

export async function generateModule(name: string, options: Record<string, string>) {
  const moduleId = name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  const ModuleTitle = name
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  const category = options.category || 'examples';
  const description = options.description || `${ModuleTitle} module`;

  // Create module directory
  const moduleDir = path.join(process.cwd(), 'modules', category, moduleId);
  if (fs.existsSync(moduleDir)) {
    throw new Error(`Module already exists: ${moduleId}`);
  }
  fs.mkdirSync(moduleDir, { recursive: true });

  // Generate module definition file
  const moduleFile = path.join(moduleDir, 'index.ts');
  const moduleContent = MODULE_TEMPLATE.replace(/{moduleId}/g, moduleId)
    .replace(/{ModuleTitle}/g, ModuleTitle)
    .replace(/{category}/g, category)
    .replace(/{Description}/g, description);

  fs.writeFileSync(moduleFile, moduleContent);

  // Update modules/index.ts to register the new module
  const modulesIndexPath = path.join(process.cwd(), 'modules', 'index.ts');
  if (fs.existsSync(modulesIndexPath)) {
    let modulesIndex = fs.readFileSync(modulesIndexPath, 'utf-8');

    // Add import statement
    const importPath = category === 'examples' 
      ? `./examples/${moduleId}` 
      : `./${category}/${moduleId}`;
    // Convert kebab-case to camelCase: ui-components-example -> uiComponentsExample
    const importName = moduleId
      .split('-')
      .map((part, index) => index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
    const importStatement = `import ${importName} from '${importPath}';`;
    
    if (!modulesIndex.includes(importStatement)) {
      // Find the last import before registerModule calls
      const lastImportMatch = modulesIndex.match(/import .+ from ['"].+['"];?\s*$/m);
      if (lastImportMatch) {
        const insertIndex = lastImportMatch.index! + lastImportMatch[0].length;
        modulesIndex =
          modulesIndex.slice(0, insertIndex) +
          '\n' +
          importStatement +
          modulesIndex.slice(insertIndex);
      } else {
        // Add after the comment
        const commentMatch = modulesIndex.match(/\/\/ Import built-in module definitions[^\n]*\n/);
        if (commentMatch) {
          const insertIndex = commentMatch.index! + commentMatch[0].length;
          modulesIndex =
            modulesIndex.slice(0, insertIndex) +
            importStatement +
            '\n' +
            modulesIndex.slice(insertIndex);
        }
      }
    }

    // Add registerModule call
    const registerStatement = `registerModule(${importName});`;
    if (!modulesIndex.includes(registerStatement)) {
      // Find the last registerModule call
      const lastRegisterMatch = modulesIndex.match(/registerModule\([^)]+\);?\s*$/m);
      if (lastRegisterMatch) {
        const insertIndex = lastRegisterMatch.index! + lastRegisterMatch[0].length;
        modulesIndex =
          modulesIndex.slice(0, insertIndex) +
          registerStatement +
          '\n' +
          modulesIndex.slice(insertIndex);
      }
    }

    fs.writeFileSync(modulesIndexPath, modulesIndex);
  }

  // Update modules/types.ts to add module ID
  const typesPath = path.join(process.cwd(), 'modules', 'types.ts');
  if (fs.existsSync(typesPath)) {
    let typesContent = fs.readFileSync(typesPath, 'utf-8');
    
    // Add module ID to ModuleId type
    const moduleIdTypeMatch = typesContent.match(/type ModuleId = (.+?);/);
    if (moduleIdTypeMatch) {
      const existingIds = moduleIdTypeMatch[1].trim();
      // Check if moduleId is already in the type
      if (!existingIds.includes(`'${moduleId}'`)) {
        const newIds = `${existingIds} | '${moduleId}'`;
        typesContent = typesContent.replace(
          /type ModuleId = (.+?);/,
          `type ModuleId = ${newIds};`,
        );
        fs.writeFileSync(typesPath, typesContent);
      }
    }
  }

  console.log(`Generated module: ${moduleId}`);
  console.log(`  Location: modules/${category}/${moduleId}/`);
  console.log(`  Definition: modules/${category}/${moduleId}/index.ts`);
}

