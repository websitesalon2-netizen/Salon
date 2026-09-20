import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const docsDir = path.join(rootDir, 'docs');
const rootAssetsDir = path.join(rootDir, 'assets');

// 1. Ensure directories exist
if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
if (!fs.existsSync(rootAssetsDir)) fs.mkdirSync(rootAssetsDir, { recursive: true });

// 2. Copy all dist files to docs/
fs.cpSync(distDir, docsDir, { recursive: true });

// 3. Find latest JS and CSS in dist/assets
const distAssetsDir = path.join(distDir, 'assets');
if (fs.existsSync(distAssetsDir)) {
  const files = fs.readdirSync(distAssetsDir);
  for (const file of files) {
    const src = path.join(distAssetsDir, file);
    const dest = path.join(rootAssetsDir, file);
    if (fs.statSync(src).isFile()) {
      fs.copyFileSync(src, dest);
      if (file.endsWith('.js') && file.startsWith('index-')) {
        fs.copyFileSync(src, path.join(rootAssetsDir, 'index.js'));
      }
      if (file.endsWith('.css') && file.startsWith('index-')) {
        fs.copyFileSync(src, path.join(rootAssetsDir, 'index.css'));
      }
    }
  }
}

// 4. Ensure .nojekyll in root, dist, and docs
fs.writeFileSync(path.join(rootDir, '.nojekyll'), '');
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
fs.writeFileSync(path.join(docsDir, '.nojekyll'), '');

// 5. Ensure 404.html in root, dist, and docs
const notFoundSrc = path.join(rootDir, 'public', '404.html');
if (fs.existsSync(notFoundSrc)) {
  fs.copyFileSync(notFoundSrc, path.join(rootDir, '404.html'));
  fs.copyFileSync(notFoundSrc, path.join(distDir, '404.html'));
  fs.copyFileSync(notFoundSrc, path.join(docsDir, '404.html'));
}

console.log('Static deployment assets successfully synchronized for GitHub Pages.');
