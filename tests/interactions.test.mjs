import test, {after, afterEach} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import {createServer} from 'vite';

const dom=new JSDOM(await readFile('index.html','utf8'),{url:'https://nethma.vercel.app/',pretendToBeVisual:true});
for(const key of ['window','document','navigator','HTMLElement','Element','Node','MutationObserver','getComputedStyle'])Object.defineProperty(globalThis,key,{value:key==='getComputedStyle'?dom.window.getComputedStyle.bind(dom.window):dom.window[key],configurable:true});
const media=()=>({matches:true,media:'',addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}});
window.matchMedia=media;globalThis.matchMedia=media;
window.scrollTo=()=>{};
HTMLElement.prototype.scrollIntoView=function(){this.dataset.scrolled='true';};
window.requestAnimationFrame=callback=>setTimeout(()=>callback(performance.now()),0);
window.cancelAnimationFrame=clearTimeout;
globalThis.requestAnimationFrame=window.requestAnimationFrame;
globalThis.cancelAnimationFrame=clearTimeout;
globalThis.IntersectionObserver=class{observe(){} unobserve(){} disconnect(){}};
globalThis.ResizeObserver=class{observe(){} unobserve(){} disconnect(){}};
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
const React=await import('react');
const {render,screen,cleanup,fireEvent,waitFor}=await import('@testing-library/react');
const {default:userEvent}=await import('@testing-library/user-event');
const {default:axe}=await import('axe-core');
const server=await createServer({server:{middlewareMode:true},appType:'custom'});
const {ErrorBoundary}=await server.ssrLoadModule('/src/App.jsx');
const {default:TestApp}=await server.ssrLoadModule('/tests/TestApp.jsx');
const {projects}=await import('../src/data/projects.js');
const {profile}=await import('../src/data/profile.js');
const {pageMetadata}=await import('../src/data/seo.js');
const {pages}=await import('../src/data/pages.js');
const mount=path=>render(React.createElement(TestApp,{path}));
afterEach(()=>cleanup());
after(async()=>{await server.close();dom.window.close();});

test('homepage contains the hero and navigation to separate pages',async()=>{
  mount('/');
  assert.ok(screen.getByRole('heading',{level:1,name:"Hi, I'm Nethma Samadhi."}));
  const nav=screen.getByRole('navigation',{name:'Primary navigation'});
  assert.equal(nav.querySelectorAll('a').length,6);
  assert.equal(screen.getByRole('link',{name:'EXPLORE PROJECTS'}).getAttribute('href'),'/projects');
  for(const id of ['projects','experience','expertise','about','contact'])assert.equal(document.getElementById(id),null);
  assert.match(screen.getByRole('img',{name:'Portrait of Nethma Samadhi'}).getAttribute('src'),/hero-final.webp/);
  await waitFor(()=>assert.equal(document.title,pageMetadata('/').title));
});
test('every page has a complete footer and no CV download controls',()=>{
  for(const route of [...pages.map(page=>page.path),...projects.map(project=>`/projects/${project.slug}`),'/missing']){
    mount(route);
    const footer=screen.getByRole('contentinfo');
    const nav=screen.getByRole('navigation',{name:'Footer navigation'});
    assert.equal(nav.querySelectorAll('a').length,pages.length);
    for(const page of pages)assert.ok([...nav.querySelectorAll('a')].some(link=>link.getAttribute('href')===page.path));
    assert.ok(footer.querySelector('a[href="tel:+94770569658"]'));
    assert.ok(footer.querySelector(`a[href="mailto:${profile.email}"]`));
    assert.equal(document.querySelectorAll('a[download]').length,0);
    assert.equal(document.querySelectorAll(`a[href="${profile.cv}"]`).length,0);
    cleanup();
  }
});

test('footer links navigate from a case study to the selected page',async()=>{
  mount('/projects/finai');
  const nav=screen.getByRole('navigation',{name:'Footer navigation'});
  fireEvent.click([...nav.querySelectorAll('a')].find(link=>link.getAttribute('href')==='/about'));
  assert.ok(screen.getByRole('heading',{level:1,name:'About Me'}));
  await waitFor(()=>assert.equal(document.querySelector('link[rel="canonical"]').href,'https://nethma.vercel.app/about'));
});

test('every project card opens its case study and returns to the Projects page',async()=>{
  for(const project of projects){
    mount('/projects');
    fireEvent.click(screen.getByRole('link',{name:`Read ${project.shortTitle} case study`}));
    assert.ok(screen.getByRole('heading',{level:1,name:project.title}));
    await waitFor(()=>assert.equal(document.querySelector('link[rel="canonical"]').href,`https://nethma.vercel.app/projects/${project.slug}`));
    fireEvent.click(screen.getByRole('link',{name:'All projects',exact:true}));
    await waitFor(()=>assert.equal(document.activeElement.id,'main'));
    assert.ok(document.getElementById('projects'));
    cleanup();
  }
});

test('project filters show the matching case studies and restore the full collection',()=>{
  mount('/projects');
  const group=screen.getByRole('group',{name:'Filter projects'});
  const button=name=>[...group.querySelectorAll('button')].find(item=>item.textContent===name);
  const cards=()=>document.querySelectorAll('#projects .project-visual-link');
  fireEvent.click(button('Mobile'));
  assert.equal(cards().length,1);
  assert.equal(cards()[0].getAttribute('href'),'/projects/cleaning-service');
  assert.equal(button('Mobile').getAttribute('aria-pressed'),'true');
  fireEvent.click(button('Web & data'));
  assert.equal(cards().length,3);
  assert.ok([...cards()].every(card=>!card.getAttribute('href').includes('cleaning-service')));
  fireEvent.click(button('All projects'));
  assert.equal(cards().length,4);
});

test('skill category filters show only the selected category and can restore all skills',()=>{
  mount('/expertise');
  const group=screen.getByRole('group',{name:'Filter skill categories'});
  const button=name=>[...group.querySelectorAll('button')].find(item=>item.textContent===name);
  const count=document.querySelectorAll('.skill-card').length;
  fireEvent.click(button('Web & SEO'));
  assert.equal(document.querySelectorAll('.skill-group').length,1);
  assert.equal(document.querySelector('.skill-group h3').textContent,'Web & SEO');
  assert.ok(document.querySelectorAll('.skill-card').length<count);
  fireEvent.click(button('All skills'));
  assert.equal(document.querySelectorAll('.skill-group').length,4);
  assert.equal(document.querySelectorAll('.skill-card').length,count);
});
test('global page navigation works from a case study, including Contact',async()=>{
  mount('/projects/finai');
  const nav=screen.getByRole('navigation',{name:'Primary navigation'});
  fireEvent.click([...nav.querySelectorAll('a')].find(a=>a.textContent==='Contact'));
  await waitFor(()=>assert.equal(document.activeElement.id,'main'));
    assert.ok(document.getElementById('contact'));
  assert.ok(screen.getByRole('heading',{level:1,name:'Let’s Work Together'}));
  assert.equal(document.querySelector('link[rel="canonical"]').href,'https://nethma.vercel.app/contact');
});
test('mobile disclosure focuses first link; Escape closes and restores toggle focus',async()=>{
  const user=userEvent.setup({document});
  mount('/');
  await waitFor(()=>assert.equal(document.activeElement.id,'main'));
  const toggle=screen.getByRole('button',{name:'Open navigation'});
  toggle.focus();
  await user.keyboard('{Enter}');
  const mobile=screen.getByRole('navigation',{name:'Mobile navigation'});
  assert.equal(toggle.getAttribute('aria-expanded'),'true');
  assert.equal(document.activeElement,mobile.querySelector('a'));
  await user.keyboard('{Escape}');
  assert.equal(toggle.getAttribute('aria-expanded'),'false');
  assert.equal(document.activeElement,toggle);
});
test('mobile navigation closes on selection and outside pointer without stealing tap focus',async()=>{
  const user=userEvent.setup({document});mount('/');
  await user.click(screen.getByRole('button',{name:'Open navigation'}));
  const mobile=screen.getByRole('navigation',{name:'Mobile navigation'});
  await user.click([...mobile.querySelectorAll('a')].find(a=>a.textContent==='Expertise'));
  await waitFor(()=>assert.equal(document.activeElement.id,'main'));
  assert.ok(document.getElementById('expertise'));
  assert.equal(mobile.hidden,true);
  await user.click(screen.getByRole('button',{name:'Open navigation'}));
  assert.notEqual(document.activeElement,mobile.querySelector('a'));
  fireEvent.pointerDown(document.getElementById('main'),{pointerType:'touch'});
  await waitFor(()=>assert.equal(mobile.hidden,true));
});

test('touch focus changes cannot dismiss the menu before a link or toggle click',async()=>{
  mount('/');
  await waitFor(()=>assert.equal(document.activeElement.id,'main'));
  const toggle=screen.getByRole('button',{name:'Open navigation'});
  for (const relatedTarget of [null,document.body,document.getElementById('main')]) {
    fireEvent.click(toggle,{detail:1});
    const mobile=screen.getByRole('navigation',{name:'Mobile navigation'});
    fireEvent.blur(toggle,{relatedTarget});
    assert.equal(mobile.hidden,false);
    const contact=[...mobile.querySelectorAll('a')].find(a=>a.textContent==='Contact');
    fireEvent.pointerDown(contact,{pointerType:'touch'});
    assert.equal(mobile.hidden,false);
    fireEvent.click(contact,{detail:1});
    await waitFor(()=>assert.equal(document.activeElement.id,'main'));
    assert.ok(document.getElementById('contact'));
    assert.equal(mobile.hidden,true);
  }
  fireEvent.click(toggle,{detail:1});
  fireEvent.blur(toggle,{relatedTarget:document.body});
  fireEvent.click(toggle,{detail:1});
  assert.equal(toggle.getAttribute('aria-expanded'),'false');
});
test('copy email writes the address and announces accessible success',async()=>{
  mount('/contact');let copied;
  Object.defineProperty(navigator,'clipboard',{value:{writeText:async text=>{copied=text;}},configurable:true});
  await waitFor(()=>assert.equal(document.activeElement.id,'main'));
  fireEvent.click(screen.getByRole('button',{name:'Copy email address'}));
  await waitFor(()=>assert.equal(screen.getByRole('status').textContent,'Email address copied.'));
  assert.equal(copied,profile.email);
  assert.equal(screen.getByRole('link',{name:profile.email}).href,`mailto:${profile.email}`);
  assert.equal(screen.getByRole('link',{name:'077 056 9658'}).getAttribute('href'),'tel:+94770569658');
});
test('clipboard denial gives a usable selection fallback without false success',async()=>{
  mount('/contact');Object.defineProperty(navigator,'clipboard',{value:{writeText:async()=>{throw Error('denied');}},configurable:true});
  await waitFor(()=>assert.equal(document.activeElement.id,'main'));
  fireEvent.click(screen.getByRole('button',{name:'Copy email address'}));
  await waitFor(()=>assert.match(screen.getByRole('status').textContent,/Copy is unavailable/));
  assert.equal(window.getSelection().toString(),profile.email);
});
test('all direct case routes include problem, architecture, contribution and scoped validation',()=>{
  for(const project of projects){mount(`/projects/${project.slug}`);
    for(const id of ['overview','problem','features','architecture','contributions'])assert.ok(document.getElementById(id));
    assert.ok(screen.getByText(project.problem));
    assert.equal(Boolean(document.getElementById('testing')),project.testing.length>0);
    for(const item of project.testing)assert.ok(document.getElementById('testing').textContent.includes(item));
    assert.equal(document.querySelectorAll('.screenshot-placeholder').length,0);cleanup();
  }
});
test('unknown route shows a useful 404 and noindex metadata',async()=>{
  mount('/not-a-project');assert.ok(screen.getByRole('heading',{level:1,name:'This page isn’t here.'}));
  await waitFor(()=>assert.equal(document.querySelector('meta[name="robots"]').content,'noindex, follow'));
  fireEvent.click(screen.getByRole('link',{name:'Back to portfolio'}));
  await waitFor(()=>assert.equal(document.querySelector('meta[name="robots"]').content,'index, follow'));
});
test('legacy section bookmarks redirect to the corresponding pages; malformed hashes remain safe',async()=>{
  for(const page of pages.filter(page=>page.path!=='/')){
    mount('/#'+page.path.slice(1));
    await waitFor(()=>assert.equal(document.querySelector('link[rel="canonical"]').href,'https://nethma.vercel.app'+page.path));
    assert.equal(screen.getByRole('navigation',{name:'Primary navigation'}).querySelector('[aria-current="page"]').getAttribute('href'),page.path);
    cleanup();
  }
  mount('/#%E0%A4%A');
  assert.ok(screen.getByRole('heading',{level:1,name:"Hi, I'm Nethma Samadhi."}));
});
test('DOM accessibility checks pass on homepage, all cases and 404',async()=>{
  for(const route of [...pages.map(page=>page.path),...projects.map(p=>`/projects/${p.slug}`),'/missing']){
    mount(route);
    await waitFor(()=>assert.equal(document.activeElement.id,'main'));
    const result=await axe.run(document.documentElement,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']},rules:{'color-contrast':{enabled:false}}});
    assert.deepEqual(result.violations.map(v=>({id:v.id,nodes:v.nodes.length})),[],route);cleanup();
  }
});
test('error boundary renders a meaningful recovery link',()=>{
  const original=console.error;console.error=()=>{};
  try{function Broken(){throw Error('test failure');}render(React.createElement(ErrorBoundary,null,React.createElement(Broken)));assert.equal(screen.getByRole('link',{name:'Reload portfolio'}).getAttribute('href'),'/');}finally{console.error=original;}
});
