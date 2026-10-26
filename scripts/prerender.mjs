import { createServer } from 'vite';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { projects } from '../src/data/projects.js';
import { pages } from '../src/data/pages.js';
import { pageMetadata, siteUrl } from '../src/data/seo.js';

const server = await createServer({server:{middlewareMode:true},appType:'custom'});
const escape = value => value.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const routes = [...pages.map(page=>page.path),...projects.map(project=>`/projects/${project.slug}`),'/404'];
try {
  const {render} = await server.ssrLoadModule('/src/entry-server.jsx');
  const template = await readFile('dist/index.html','utf8');
  for(const route of routes){
    const metadata = pageMetadata(route);
    let html = template.replace('<div id="root"></div>',`<div id="root" data-route="${route}">${render(route)}</div>`)
      .replace(/<title>.*?<\/title>/,`<title>${escape(metadata.title)}</title>`)
      .replace(/(<link rel="canonical" href=")[^"]*/,`$1${metadata.canonical}`)
      .replace(/(<script id="page-schema" type="application\/ld\+json">).*?(<\/script>)/,`$1${JSON.stringify(metadata.schema).replaceAll('<','\\u003c')}$2`);
    for(const [attribute,name,value] of [
      ['name','description',metadata.description],['name','robots',metadata.robots],
      ['property','og:title',metadata.title],['property','og:description',metadata.description],['property','og:url',metadata.canonical],
      ['name','twitter:title',metadata.title],['name','twitter:description',metadata.description],
    ])html=html.replace(new RegExp(`(<meta ${attribute}="${name}" content=")[^"]*`),`$1${escape(value)}`);
    const destination=route==='/404'?'dist/404.html':path.join('dist',route,'index.html');
    await mkdir(path.dirname(destination),{recursive:true});await writeFile(destination,html);
  }
  await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);
  const urls=routes.filter(route=>route!=='/404').map(route=>`  <url><loc>${siteUrl}${route}</loc></url>`).join('\n');
  await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
  console.log(`Prerendered ${routes.length} pages; generated robots.txt and sitemap.xml.`);
} finally {await server.close();}
