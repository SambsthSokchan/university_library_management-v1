const fs = require('fs');
const path = require('path');

const dir = 'd:/university_library_management/library-frontend/app/dashboard';

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace text colors
  content = content.replace(/text-white/g, 'text-text-primary');
  content = content.replace(/text-zinc-400/g, 'text-text-muted');
  content = content.replace(/text-zinc-500/g, 'text-text-muted');
  content = content.replace(/text-zinc-600/g, 'text-text-dim');

  // Replace borders
  content = content.replace(/border-white\/[0-9]+/g, 'border-ink-700 border');
  
  // Replace backgrounds
  content = content.replace(/bg-white\/[0-9]+/g, 'bg-ink-700');
  content = content.replace(/hover:bg-white\/[0-9]+/g, 'hover:bg-ink-600');
  
  // Replace hardcoded zinc backgrounds
  content = content.replace(/bg-zinc-[0-9]+/g, 'bg-ink-800');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function traverseDir(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      traverseDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      processFile(fullPath);
    }
  }
}

traverseDir(dir);
