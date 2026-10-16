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
const mount=path=>render(React.createElement(TestApp,{path}));
afterEach(()=>cleanup());
after(async()=>{await server.close();dom.window.close();});

test('homepage renders the requested identity, five sections and four project links',async()=>{
  mount('/');
  assert.ok(screen.getByRole('heading',{level:1,name:"Hi, I'm Nethma Samadhi."}));
  const nav=screen.getByRole('navigation',{name:'Primary navigation'});
  assert.equal(nav.querySelectorAll('a').length,5);
  for(const project of projects)assert.equal(screen.getByRole('link',{name:`Read ${project.shortTitle} case study`}).getAttribute('href'),`/projects/${project.slug}`);
  await waitFor(()=>assert.equal(document.title,pageMetadata('/').title));
});
test('every project card opens its case study and return navigation focuses Projects',async()=>{
  for(const project of projects){
    mount('/');
    fireEvent.click(screen.getByRole('link',{name:`Read ${project.shortTitle} case study`}));
    assert.ok(screen.getByRole('heading',{level:1,name:project.title}));
    await waitFor(()=>assert.equal(document.querySelector('link[rel="canonical"]').href,`https://nethma.vercel.app/projects/${project.slug}`));
    fireEvent.click(screen.getByRole('link',{name:'All projects',exact:true}));
    await waitFor(()=>assert.equal(document.activeElement.id,'projects'));
    cleanup();
  }
});
test('global section navigation works from a case study, including Contact',async()=>{
  mount('/projects/finai');
  const nav=screen.getByRole('navigation',{name:'Primary navigation'});
  fireEvent.click([...nav.querySelectorAll('a')].find(a=>a.textContent==='Contact'));
  await waitFor(()=>assert.equal(document.activeElement.id,'contact'));
  assert.ok(screen.getByRole('heading',{level:1,name:"Hi, I'm Nethma Samadhi."}));
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
  await waitFor(()=>assert.equal(document.activeElement.id,'expertise'));
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
    await waitFor(()=>assert.equal(document.activeElement.id,'contact'));
    assert.equal(mobile.hidden,true);
  }
  fireEvent.click(toggle,{detail:1});
  fireEvent.blur(toggle,{relatedTarget:document.body});
  fireEvent.click(toggle,{detail:1});
  assert.equal(toggle.getAttribute('aria-expanded'),'false');
});
test('copy email writes the address and announces accessible success',async()=>{
  mount('/');let copied;
  Object.defineProperty(navigator,'clipboard',{value:{writeText:async text=>{copied=text;}},configurable:true});
  await waitFor(()=>assert.equal(document.activeElement.id,'main'));
  fireEvent.click(screen.getByRole('button',{name:'Copy email address'}));
  await waitFor(()=>assert.equal(screen.getByRole('status').textContent,'Email address copied.'));
  assert.equal(copied,profile.email);
  assert.equal(screen.getByRole('link',{name:profile.email}).href,`mailto:${profile.email}`);
  assert.equal(screen.getByRole('link',{name:'077 056 9658'}).getAttribute('href'),'tel:+94770569658');
});
test('clipboard denial gives a usable selection fallback without false success',async()=>{
  mount('/');Object.defineProperty(navigator,'clipboard',{value:{writeText:async()=>{throw Error('denied');}},configurable:true});
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
test('same-section links scroll again; malformed hash remains safe',async()=>{
  mount('/#%E0%A4%A');
  const nav=screen.getByRole('navigation',{name:'Primary navigation'});
  const link=nav.querySelector('a');fireEvent.click(link);
  await waitFor(()=>assert.equal(document.getElementById('projects').dataset.scrolled,'true'));
  delete document.getElementById('projects').dataset.scrolled;
  fireEvent.click(link);
  await waitFor(()=>assert.equal(document.getElementById('projects').dataset.scrolled,'true'));
});
test('DOM accessibility checks pass on homepage, all cases and 404',async()=>{
  for(const route of ['/',...projects.map(p=>`/projects/${p.slug}`),'/missing']){
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
