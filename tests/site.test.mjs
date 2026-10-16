import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, access} from 'node:fs/promises';
import {projects} from '../src/data/projects.js';

test('homepage is prerendered with requested sections in order', async () => {
  const html = await readFile('dist/index.html','utf8');
  const ids = ['projects','experience','expertise','about','contact'];
  const positions = ids.map(id=>html.indexOf(`id="${id}"`));
  assert.ok(positions.every((position,index)=>position>=0 && (index===0 || position>positions[index-1])));
  assert.match(html,/Nethma Samadhi/);
  assert.match(html,/aria-controls="mobile-nav"/);
  assert.match(html,/Skip to content/);
});
test('all four case-study routes have unique metadata and real content', async () => {
  assert.equal(projects.length,4);
  for(const project of projects){
    const html = await readFile(`dist/projects/${project.slug}/index.html`,'utf8');
    assert.ok(html.includes(`<title>${project.shortTitle} | Nethma Samadhi</title>`));
    assert.ok(html.includes(`data-route="/projects/${project.slug}"`));
    for(const id of ['overview','features','contributions','testing','screenshots']) assert.ok(html.includes(`id="${id}"`));
    assert.ok(html.includes(project.overview));
    assert.ok(html.includes('SCREENSHOT PLACEHOLDER'));
    assert.ok(!html.includes('Download demo'));
  }
});
test('public pages exclude private phone, home address and references', async () => {
  for(const file of ['dist/index.html',...projects.map(project=>`dist/projects/${project.slug}/index.html`)]){
    const html = await readFile(file,'utf8');
    assert.doesNotMatch(html,/0770569658|770569658|Samadhi Sewana|Naran Aththeyaya|Induranga De Silva|Sandaruwani Kulathunga|tel:/i);
  }
  await access('dist/Nethma-Samadhi-CV.pdf');
});
test('no invented project URLs or unlabelled screenshots', () => {
  for(const project of projects){assert.equal(project.screenshots.length,0);assert.equal(project.demo,undefined);if(project.repository) assert.ok(['https://github.com/Samadhi66/Library-Management-Sytem','https://github.com/Samadhi66/Ayurvedic-Management-System','https://github.com/Samadhi66/Cleaner-App'].includes(project.repository));}
});
