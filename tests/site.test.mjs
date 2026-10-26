import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, access} from 'node:fs/promises';
import {projects} from '../src/data/projects.js';
import {pages} from '../src/data/pages.js';
const publicRoutes=[...pages.map(page=>page.path),...projects.map(p=>`/projects/${p.slug}`)];
import {JSDOM} from 'jsdom';
import {pageMetadata, siteUrl} from '../src/data/seo.js';

test('homepage contains the hero only; each separate page is prerendered with its own content', async () => {
  const html=await readFile('dist/index.html','utf8');
  for(const id of ['projects','experience','expertise','about','contact'])assert.ok(!html.includes(`id="${id}"`));
  assert.match(html,/NETHMA SAMADHI/);
  assert.match(html,/aria-controls="mobile-nav"/);
  assert.match(html,/Skip to content/);
  for(const page of pages.filter(page=>page.path!=='/')){
    const doc=new JSDOM(await readFile(`dist${page.path}/index.html`,'utf8')).window.document;
    assert.ok(doc.getElementById(page.path.slice(1)));
    assert.equal(doc.querySelectorAll('h1').length,1);
    for(const other of pages.filter(other=>other.path!=='/'&&other.path!==page.path))assert.equal(doc.getElementById(other.path.slice(1)),null);
  }
});

test('all four case-study routes have unique metadata and real content', async () => {
  assert.equal(projects.length,4);
  for(const project of projects){
    const html = await readFile(`dist/projects/${project.slug}/index.html`,'utf8');
    assert.ok(html.includes(`<title>${project.shortTitle} | Nethma Samadhi</title>`));
    assert.ok(html.includes(`data-route="/projects/${project.slug}"`));
    for(const id of ['overview','problem','features','architecture','contributions']) assert.ok(html.includes(`id="${id}"`));
    assert.ok(html.includes(project.overview));
    assert.ok(!html.includes('SCREENSHOT PLACEHOLDER'));
    assert.equal(html.includes('id="screenshots"'), project.screenshots.length > 0);
    assert.equal(html.includes('id="testing"'),project.testing.length>0);
    await access(`dist${project.cover.src}`);
    await access(`dist/projects/${project.slug}-interface-768.webp`);
    assert.ok(!html.includes('Download demo'));
  }
});
test('public pages exclude home address and references', async () => {
  for(const file of publicRoutes.map(route=>`dist${route==='/'?'':route}/index.html`)){
    const html = await readFile(file,'utf8');
    assert.doesNotMatch(html,/Samadhi Sewana|Naran Aththeyaya|Induranga De Silva|Sandaruwani Kulathunga/i);
  }
  await access('dist/Nethma-Samadhi-CV.pdf');
});
test('no invented project URLs or unlabelled screenshots', () => {
  for(const project of projects){assert.equal(project.screenshots.length,0);assert.equal(project.demo,undefined);if(project.repository) assert.ok(['https://github.com/Samadhi66/Library-Management-Sytem','https://github.com/Samadhi66/Ayurvedic-Management-System','https://github.com/Samadhi66/Cleaner-App'].includes(project.repository));}
});

test('all pages have matching canonical, social metadata and valid structured data',async()=>{
  for(const route of [...publicRoutes,'/404']){
    const dom=new JSDOM(await readFile(route==='/404'?'dist/404.html':`dist${route==='/'?'':route}/index.html`,'utf8'));
    const document=dom.window.document;const metadata=pageMetadata(route);
    assert.equal(document.title,metadata.title);
    assert.equal(document.querySelector('link[rel="canonical"]').href,metadata.canonical);
    for(const name of ['og:title','twitter:title'])assert.equal(document.querySelector(`meta[${name.startsWith('og')?'property':'name'}="${name}"]`).content,metadata.title);
    assert.equal(document.querySelector('meta[property="og:url"]').content,metadata.canonical);
    assert.deepEqual(JSON.parse(document.getElementById('page-schema').textContent),metadata.schema);
    assert.equal(document.querySelector('meta[name="robots"]').content,metadata.robots);
    assert.equal(document.querySelectorAll('h1').length,1);dom.window.close();
  }
});
test('crawler files list all canonical public routes and exclude the error page',async()=>{
  const sitemap=await readFile('dist/sitemap.xml','utf8');const robots=await readFile('dist/robots.txt','utf8');
  assert.ok(robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`));
  assert.equal((sitemap.match(/<loc>/g)||[]).length,publicRoutes.length);
  for(const route of publicRoutes)assert.ok(sitemap.includes(`<loc>${siteUrl}${route}</loc>`));
  assert.ok(!sitemap.includes('/404'));
});
test('every generated local link, anchor, image and responsive source resolves',async()=>{
  for(const route of publicRoutes){
    const file=`dist${route==='/'?'':route}/index.html`;
    const dom=new JSDOM(await readFile(file,'utf8'),{url:`${siteUrl}${route}`});const document=dom.window.document;
    for(const element of document.querySelectorAll('a[href],img[src],script[src],link[href]')){
      const value=element.getAttribute('href')||element.getAttribute('src');const url=new URL(value,`${siteUrl}${route}`);
      if(url.origin!==siteUrl)continue;
      const isPage=publicRoutes.includes(url.pathname);
      const target=isPage?`dist${url.pathname==='/'?'':url.pathname}/index.html`:`dist${decodeURIComponent(url.pathname)}`;
      await access(target);
      if(url.hash){const targetDom=new JSDOM(await readFile(target,'utf8'));assert.ok(targetDom.window.document.getElementById(url.hash.slice(1)),value);targetDom.window.close();}
    }
    for(const image of document.images){assert.ok(image.alt);for(const candidate of (image.srcset||'').split(',').filter(Boolean))await access(`dist${candidate.trim().split(' ')[0]}`);}
    for(const link of document.querySelectorAll('a[target="_blank"]')){assert.ok(link.rel.includes('noopener'));assert.ok(link.rel.includes('noreferrer'));}
    dom.window.close();
  }
});
test('Vercel serves known prerendered routes without a catch-all soft 404 rewrite',async()=>{
  const config=JSON.parse(await readFile('vercel.json','utf8'));
  assert.equal(config.outputDirectory,'dist');assert.equal(config.framework,'vite');
  assert.equal(config.rewrites.length,publicRoutes.length-1);
  for(const route of publicRoutes.filter(route=>route!=='/'))assert.ok(config.rewrites.some(r=>r.source===route&&r.destination===`${route}/index.html`));
  for(const project of projects)assert.ok(config.rewrites.some(r=>r.source===`/projects/${project.slug}`&&r.destination===`/projects/${project.slug}/index.html`));
  await access('dist/404.html');assert.equal((await readFile('dist/Nethma-Samadhi-CV.pdf')).subarray(0,5).toString(),'%PDF-');
});
test('design text tokens meet AA contrast across every surface',async()=>{
  const css=await readFile('src/styles.css','utf8');
  const token=name=>css.match(new RegExp(`--${name}:(#[0-9a-f]{6})`))[1];
  const luminance=hex=>hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
  const contrast=(a,b)=>(Math.max(luminance(a),luminance(b))+.05)/(Math.min(luminance(a),luminance(b))+.05);
  for(const foreground of ['text','muted','mint'])for(const background of ['background','surface','surface-secondary'])assert.ok(contrast(token(foreground),token(background))>=4.5,`${foreground}/${background}`);
  assert.ok(contrast(token('background'),token('mint'))>=4.5);
});
