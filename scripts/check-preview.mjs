import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import {projects} from '../src/data/projects.js';
import {pages} from '../src/data/pages.js';

// Run after building, against a local preview or the deployed version of this commit.
const base=(process.argv[2] || 'http://127.0.0.1:4173').replace(/\/$/,'');
const routes=[...pages.map(page=>page.path),...projects.map(p=>`/projects/${p.slug}`)];
const resources=new Set(['/Nethma-Samadhi-CV.pdf','/robots.txt','/sitemap.xml','/images/nethma-samadhi-social.jpg']);
let requests=0;
async function request(path,status=200){
  const response=await fetch(`${base}${path}`,{signal:AbortSignal.timeout(15000)});requests++;
  assert.equal(response.status,status,`${path}: expected ${status}, received ${response.status}`);
  return response;
}
for(const route of routes){
  const response=await request(route);const document=new JSDOM(await response.text()).window.document;
  const expected=new JSDOM(await readFile(`dist${route==='/'?'':route}/index.html`,'utf8')).window.document;
  assert.equal(document.title,expected.title,`${route}: release title differs`);
  assert.equal(document.querySelector('link[rel="canonical"]').href,expected.querySelector('link[rel="canonical"]').href);
  for(const node of document.querySelectorAll('img[src],script[src],link[href]')){
    const path=node.getAttribute('src') || node.getAttribute('href');if(path.startsWith('/'))resources.add(path);
  }
  for(const image of document.images)for(const candidate of (image.srcset||'').split(',').filter(Boolean))resources.add(candidate.trim().split(' ')[0]);
}
for(const filename of await readdir('dist/assets'))resources.add(`/assets/${filename}`);
for(const path of resources){
  const response=await request(path);
  if(path.endsWith('.pdf')){assert.match(response.headers.get('content-type'),/application\/pdf/);assert.equal(Buffer.from(await response.arrayBuffer()).subarray(0,5).toString(),'%PDF-');}
  else if(path==='/robots.txt')assert.ok((await response.text()).includes('https://nethma.vercel.app/sitemap.xml'));
  else if(path==='/sitemap.xml')assert.equal(((await response.text()).match(/<loc>/g)||[]).length,routes.length);
  else await response.arrayBuffer();
}
for(const path of ['/__portfolio_missing_route__','/projects/not-a-project']){
  const response=await request(path,404);assert.match(await response.text(),/This page isn’t here/);
}
console.log(`Passed ${requests} HTTP checks against ${base}: pages, metadata, PDF, crawler files, assets and true 404 responses.`);
