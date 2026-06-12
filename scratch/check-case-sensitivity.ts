import fs from 'fs';
import path from 'path';

// Helper to check if file exist with exact casing
function checkPathCasing(targetPath: string): { exists: boolean; correctCasing?: string; matched: boolean } {
  const normalized = path.normalize(targetPath);
  const parts = normalized.split(path.sep);
  let currentPath = '';

  // Handle absolute drive letter on Windows (e.g. "C:")
  let startIndex = 0;
  if (parts[0] && parts[0].endsWith(':')) {
    currentPath = parts[0] + path.sep;
    startIndex = 1;
  } else if (normalized.startsWith(path.sep)) {
    currentPath = path.sep;
  }

  for (let i = startIndex; i < parts.length; i++) {
    const part = parts[i];
    if (!part) continue;

    // Check directory contents
    const parentDir = currentPath || '.';
    if (!fs.existsSync(parentDir)) {
      return { exists: false, matched: false };
    }

    const files = fs.readdirSync(parentDir);
    const exactMatch = files.find(f => f === part);
    const caseInsensitiveMatch = files.find(f => f.toLowerCase() === part.toLowerCase());

    if (!caseInsensitiveMatch) {
      // Path segment doesn't exist
      return { exists: false, matched: false };
    }

    if (!exactMatch) {
      // Exist but casing is incorrect
      return {
        exists: true,
        matched: false,
        correctCasing: path.join(currentPath, caseInsensitiveMatch)
      };
    }

    currentPath = path.join(currentPath, part);
  }

  return { exists: true, matched: true };
}

function walkDir(dir: string, callback: (filePath: string) => void) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        walkDir(fullPath, callback);
      }
    } else {
      callback(fullPath);
    }
  });
}

const aliasMap: Record<string, string> = {
  '@/': path.resolve(process.cwd(), 'src') + '/'
};

function resolveImportPath(importStr: string, currentFile: string): string | null {
  if (importStr.startsWith('.') || importStr.startsWith('..')) {
    return path.resolve(path.dirname(currentFile), importStr);
  }

  for (const [alias, realPath] of Object.entries(aliasMap)) {
    if (importStr.startsWith(alias)) {
      return importStr.replace(alias, realPath);
    }
  }

  return null; // external package (e.g. 'react', 'next-intl')
}

// Find possible file extensions
function findExactFile(resolvedPath: string): string | null {
  const extensions = ['.tsx', '.ts', '.jsx', '.js', '/page.tsx', '/page.ts', '/route.ts'];
  if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isFile()) {
    return resolvedPath;
  }
  for (const ext of extensions) {
    const p = resolvedPath + ext;
    if (fs.existsSync(p) && fs.statSync(p).isFile()) {
      return p;
    }
  }
  return null;
}

const importRegex = /(?:import|from|require)\s*\(?\s*['"]([^'"]+)['"]/g;

async function main() {
  console.log("Starting case sensitivity audit on imports...");
  let issueCount = 0;

  walkDir(path.resolve(process.cwd(), 'src'), (filePath) => {
    if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx') && !filePath.endsWith('.js') && !filePath.endsWith('.jsx')) {
      return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      const importStr = match[1];
      const resolved = resolveImportPath(importStr, filePath);
      if (!resolved) continue;

      const exactFile = findExactFile(resolved);
      if (!exactFile) {
        // Could be a dynamic resolution or missing file altogether
        console.warn(`⚠️ [Missing or Unresolved] ${path.basename(filePath)} imports "${importStr}"`);
        continue;
      }

      const check = checkPathCasing(exactFile);
      if (!check.matched) {
        console.error(`❌ [Casing Error] in ${path.relative(process.cwd(), filePath)}:`);
        console.error(`   Imported:  "${importStr}"`);
        console.error(`   Resolved:  ${path.relative(process.cwd(), exactFile)}`);
        if (check.correctCasing) {
          console.error(`   Correct Casing on disk: ${path.relative(process.cwd(), check.correctCasing)}`);
        }
        issueCount++;
      }
    }
  });

  console.log(`\nCase sensitivity audit finished. Total issues found: ${issueCount}`);
}

main().catch(console.error);
