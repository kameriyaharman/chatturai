// Renders every route to its own static HTML file in dist/ (index.html, portfolio.html, …)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const { render, renderBook, PAGES } = await import(pathToFileURL(path.join(root, 'dist-server/entry-server.js')).href);

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

for (const [url, page] of Object.entries(PAGES)) {
  const html = template
    .replace('<!--app-html-->', render(url))
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(page.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(page.description)}" />`)
    .replace('<body class="p-home">', `<body class="${page.body}">`);
  const file = url === '/' ? 'index.html' : `${url.slice(1)}.html`;
  fs.writeFileSync(path.join(dist, file), html);
  console.log('prerendered', url, '->', file);
}

// Book-a-call: its own page/template (own CSS, noindex)
const bookFile = path.join(dist, 'book-a-call.html');
fs.writeFileSync(bookFile, fs.readFileSync(bookFile, 'utf8').replace('<!--app-html-->', renderBook()));
console.log('prerendered /book-a-call -> book-a-call.html');
