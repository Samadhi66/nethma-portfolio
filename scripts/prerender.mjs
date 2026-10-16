import { createServer } from 'vite';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { projects } from '../src/data/projects.js';

const server = await createServer({server: {middlewareMode: true}, appType: 'custom'});
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
try {
  const {render} = await server.ssrLoadModule('/src/entry-server.jsx');
  const template = await readFile('dist/index.html', 'utf8');
  const pages = [{route: '/', title: 'Nethma Samadhi | Software, Web & Data'}, ...projects.map(project => ({route: `/projects/${project.slug}`, title: `${project.shortTitle} | Nethma Samadhi`, description: project.summary})), {route: '/404', title: 'Page not found | Nethma Samadhi'}];
  for (const page of pages) {
    let html = template.replace('<div id="root"></div>', `<div id="root" data-route="${page.route}">${render(page.route)}</div>`).replace(/<title>.*?<\/title>/, `<title>${escape(page.title)}</title>`).replace(/(<meta property="og:title" content=")[^"]*/, `$1${escape(page.title)}`);
    if (page.description) html = html.replace(/(<meta name="description" content=")[^"]*/, `$1${escape(page.description)}`).replace(/(<meta property="og:description" content=")[^"]*/, `$1${escape(page.description)}`);
    const destination = page.route === '/404' ? 'dist/404.html' : path.join('dist', page.route, 'index.html');
    await mkdir(path.dirname(destination), {recursive: true});
    await writeFile(destination, html);
  }
  console.log(`Prerendered ${pages.length} pages with route-specific metadata.`);
} finally {await server.close();}
