#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');

// Make sure we exclude test files
const files = fs.readdirSync(distDir)
  .filter(file => file.endsWith('.js') && !file.includes('.test.'));

console.log('Fixing import paths in compiled files...');

for (const file of files) {
  const filePath = path.join(distDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace relative imports with .js extension
  content = content.replace(/from\s+["']\.\/([^"']+)["']/g, (match, importPath) => {
    // Only add .js if it doesn't already have an extension
    if (!importPath.includes('.')) {
      return `from "./${importPath}.js"`;
    }
    return match;
  });
  
  fs.writeFileSync(filePath, content);
  console.log(`✅ Fixed imports in ${file}`);
}

console.log('All import paths fixed. Build completed successfully!'); 