/**
 * Component Generator
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Generates a new component with TypeScript types and styling
 */

import * as fs from 'fs';
import * as path from 'path';

const COMPONENT_TEMPLATE = `// Created by Kien AI (leejungkiin@gmail.com)
import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from 'heroui-native';

export interface {ComponentName}Props {
  // Add your props here
  style?: ViewStyle;
}

export function {ComponentName}({ style }: {ComponentName}Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }, style]}>
      <Text style={[styles.text, { color: colors.foreground }]}>{ComponentName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  text: {
    fontSize: 16,
  },
});
`;

const INDEX_TEMPLATE = `/**
 * {Category} Components Export
 * Created by Kien AI (leejungkiin@gmail.com)
 */

export * from './{ComponentName}';
`;

export async function generateComponent(name: string, options: Record<string, string>) {
  // Convert name to PascalCase: my-component -> MyComponent
  const ComponentName = name
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  const category = options.category || 'common';
  const componentDir = path.join(process.cwd(), 'components', category);

  // Create category directory if it doesn't exist
  if (!fs.existsSync(componentDir)) {
    fs.mkdirSync(componentDir, { recursive: true });
  }

  // Check if component already exists
  const componentFile = path.join(componentDir, `${ComponentName}.tsx`);
  if (fs.existsSync(componentFile)) {
    throw new Error(`Component already exists: ${ComponentName}`);
  }

  // Generate component file
  const componentContent = COMPONENT_TEMPLATE.replace(/{ComponentName}/g, ComponentName);
  fs.writeFileSync(componentFile, componentContent);

  // Update or create index.ts
  const indexFile = path.join(componentDir, 'index.ts');
  if (fs.existsSync(indexFile)) {
    let indexContent = fs.readFileSync(indexFile, 'utf-8');
    const exportStatement = `export * from './${ComponentName}';`;
    
    if (!indexContent.includes(exportStatement)) {
      // Add export at the end
      indexContent = indexContent.trim() + '\n' + exportStatement + '\n';
      fs.writeFileSync(indexFile, indexContent);
    }
  } else {
    // Create new index.ts
    const indexContent = INDEX_TEMPLATE
      .replace(/{Category}/g, category.charAt(0).toUpperCase() + category.slice(1))
      .replace(/{ComponentName}/g, ComponentName);
    fs.writeFileSync(indexFile, indexContent);
  }

  // Update root components/index.ts if it exists
  const rootIndexFile = path.join(process.cwd(), 'components', 'index.ts');
  if (fs.existsSync(rootIndexFile)) {
    let rootIndex = fs.readFileSync(rootIndexFile, 'utf-8');
    const categoryExport = `export * from './${category}';`;
    
    if (!rootIndex.includes(categoryExport)) {
      rootIndex = rootIndex.trim() + '\n' + categoryExport + '\n';
      fs.writeFileSync(rootIndexFile, rootIndex);
    }
  }

  console.log(`Generated component: ${ComponentName}`);
  console.log(`  Location: components/${category}/${ComponentName}.tsx`);
  console.log(`  Export: components/${category}/index.ts`);
}

