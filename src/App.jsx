import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router';
import { MotionConfig } from 'motion/react';
import { Navigation, Contact, Footer } from './components/Layout';
import { projects } from './data/projects';
import Home from './pages/Home';
import { ScrollProgress, PageEntrance } from './components/PageMotion';
import Project, { NotFound } from './pages/Project';

function RouteEffects() {
  const {pathname, hash} = useLocation();
  useEffect(() => {
    const project = projects.find(item => pathname === `/projects/${item.slug}`);
    const title = project ? `${project.shortTitle} | Nethma Samadhi` : pathname === '/' ? 'Nethma Samadhi | Software, Web & Data' : 'Page not found | Nethma Samadhi';
    const description = project?.summary || 'Nethma Samadhi — Software Engineering undergraduate exploring full-stack development, QA, web optimization and data analytics. View projects and experience.';
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
    const timer = requestAnimationFrame(() => {
      const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : document.getElementById('main');
      if (hash && target) target.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
      else {window.scrollTo({top: 0, behavior: 'instant'}); target?.focus({preventScroll: true});}
    });
    return () => cancelAnimationFrame(timer);
  }, [pathname, hash]);
  return null;
}
export default function App() {return <MotionConfig reducedMotion="user"><RouteEffects/><ScrollProgress/><a className="skip-link" href="#main">Skip to content</a><Navigation/><main id="main" tabIndex={-1}><PageEntrance><Routes><Route path="/" element={<Home/>}/><Route path="/projects/:slug" element={<Project/>}/><Route path="*" element={<NotFound/>}/></Routes></PageEntrance><Contact/></main><Footer/></MotionConfig>;}
