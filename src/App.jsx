import { Component, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router';
import { MotionConfig, LazyMotion, domAnimation } from 'motion/react';
import { Navigation, Contact, Footer } from './components/Layout';
import { pageMetadata, socialImage } from './data/seo';
import Home from './pages/Home';
import { ProjectsPage, ExperiencePage, ExpertisePage, AboutPage } from './pages/PortfolioPages';
import { ScrollProgress, PageEntrance } from './components/PageMotion';
import Project, { NotFound } from './pages/Project';
import AnimatedCursor from './components/AnimatedCursor';

function RouteEffects(){
  const {pathname,hash,key}=useLocation();
  useEffect(()=>{
    const metadata=pageMetadata(pathname);
    document.title=metadata.title;
    for(const [selector,value] of [
      ['meta[name="description"]',metadata.description],['meta[name="robots"]',metadata.robots],
      ['meta[property="og:title"]',metadata.title],['meta[property="og:description"]',metadata.description],
      ['meta[property="og:url"]',metadata.canonical],['meta[property="og:image"]',socialImage],
      ['meta[name="twitter:title"]',metadata.title],['meta[name="twitter:description"]',metadata.description],
    ])document.querySelector(selector)?.setAttribute('content',value);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href',metadata.canonical);
    const schema=document.getElementById('page-schema');
    if(schema)schema.textContent=JSON.stringify(metadata.schema);
    const timer=requestAnimationFrame(()=>{
      let anchor=hash.slice(1);try{anchor=decodeURIComponent(anchor);}catch{/* Malformed fragments remain literal. */}
      const target=document.getElementById(anchor || 'main');
      if(hash&&target){target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});target.focus({preventScroll:true});}
      else{window.scrollTo({top:0,behavior:'instant'});document.getElementById('main')?.focus({preventScroll:true});}
    });
    return ()=>cancelAnimationFrame(timer);
  },[pathname,hash,key]);
  return null;
}
export class ErrorBoundary extends Component {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  render(){return this.state.failed?<main className="container not-found"><h1>Something didn’t load.</h1><p>Please reload the portfolio to try again.</p><a className="button button-primary" href="/">Reload portfolio</a></main>:this.props.children;}
}
export default function App(){return <ErrorBoundary><MotionConfig reducedMotion="user"><LazyMotion features={domAnimation} strict><RouteEffects/><ScrollProgress/><AnimatedCursor/><a className="skip-link" href="#main">Skip to content</a><Navigation/><main id="main" tabIndex={-1}><PageEntrance><Routes><Route path="/" element={<Home/>}/><Route path="/projects" element={<ProjectsPage/>}/><Route path="/experience" element={<ExperiencePage/>}/><Route path="/expertise" element={<ExpertisePage/>}/><Route path="/about" element={<AboutPage/>}/><Route path="/contact" element={<Contact/>}/><Route path="/projects/:slug" element={<Project/>}/><Route path="*" element={<NotFound/>}/></Routes></PageEntrance></main><Footer/></LazyMotion></MotionConfig></ErrorBoundary>;}
