import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { ArrowUpRight, ArrowUp, Menu, X, Copy, Check, Phone, Mail, Github, Linkedin } from 'lucide-react';
import { profile } from '../data/profile';
import { pages } from '../data/pages';
import { ExternalLink } from './UI';

const links = pages;
export function Navigation() {
  const location = useLocation();
  const [open,setOpen] = useState(false);
  const active = location.pathname.startsWith('/projects/') ? '/projects' : location.pathname;
  const toggle = useRef(null);
  const menu = useRef(null);
  const keyboardOpen = useRef(false);
  useEffect(()=>{setOpen(false);},[location]);
  useEffect(()=>{
    if (!open) return;
    if (keyboardOpen.current) menu.current?.querySelector('a')?.focus({preventScroll:true});
    const onKey=event=>{if(event.key==='Escape'){setOpen(false);toggle.current?.focus();}};
    const onPointer=event=>{if(!menu.current?.contains(event.target)&&!toggle.current?.contains(event.target))setOpen(false);};
    const media=window.matchMedia('(min-width: 801px)');
    const onResize=()=>{if(media.matches)setOpen(false);};
    document.addEventListener('keydown',onKey);document.addEventListener('pointerdown',onPointer,true);media.addEventListener('change',onResize);
    return ()=>{document.removeEventListener('keydown',onKey);document.removeEventListener('pointerdown',onPointer,true);media.removeEventListener('change',onResize);};
  },[open]);
  const navLink=({label,path})=><Link key={path} to={path} className={active===path?'is-active':undefined} aria-current={active===path?'page':undefined} onClick={()=>setOpen(false)}>{label}</Link>;
  // Touch browsers can move focus outside before firing a link's click. Blur must
  // never unmount the tap target; close on selection, outside pointer or Escape.
  return <header className="site-header">
    <div className="container header-inner"><Link to="/" aria-label="Nethma Samadhi home" className="wordmark"><span className="brand-monogram" aria-hidden="true">ns<span>.</span></span><span className="wordmark-copy">NETHMA<span className="wordmark-surname"> SAMADHI</span><small>SOFTWARE &amp; WEB</small></span></Link>
      <nav className="desktop-nav" aria-label="Primary navigation">{links.map(navLink)}</nav>
      <Link className="header-contact" to="/contact">LET’S TALK<ArrowUpRight size={17} aria-hidden="true"/></Link>
      <button ref={toggle} type="button" className="menu-toggle" aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open} aria-controls="mobile-nav" onClick={event=>{keyboardOpen.current=event.detail===0;setOpen(value=>!value);}}>{open?<X size={23} aria-hidden="true"/>:<Menu size={23} aria-hidden="true"/>}</button>
    </div>
    <nav ref={menu} id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation" hidden={!open}>{links.map(navLink)}</nav>
  </header>;
}
export function Contact() {
  const [message,setMessage]=useState('');
  const [copied,setCopied]=useState(false);
  const timer=useRef();
  const email=useRef(null);
  useEffect(()=>()=>clearTimeout(timer.current),[]);
  async function copyEmail(){
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);setMessage('Email address copied.');
    } catch {
      const selection=window.getSelection();
      const range=document.createRange();range.selectNodeContents(email.current);selection?.removeAllRanges();selection?.addRange(range);
      setCopied(false);setMessage('Copy is unavailable. The email is selected; use your device’s copy command.');
    }
    clearTimeout(timer.current);timer.current=setTimeout(()=>{setCopied(false);setMessage('');},7000);
  }
  return <section id="contact" tabIndex={-1} aria-labelledby="contact-title" className="contact-section page-section"><div className="container"><p className="eyebrow"><span className="status-dot"/> LET’S CONNECT</p>
    <div className="contact-heading"><h1 id="contact-title">Let’s Work <span className="text-mint">Together</span></h1><a className="contact-arrow" href={`mailto:${profile.email}`} aria-label="Email Nethma Samadhi"><ArrowUpRight strokeWidth={1.2} size={60} aria-hidden="true"/></a></div>
    <div className="contact-bottom"><p>I’m interested in early-career opportunities across software and web development, QA, technical analysis and digital operations.</p><div className="email-block"><a ref={email} className="email-link" href={`mailto:${profile.email}`}>{profile.email}</a><button type="button" onClick={copyEmail} className="copy-button">{copied?<Check size={16} aria-hidden="true"/>:<Copy size={16} aria-hidden="true"/>}{copied?'Copied':'Copy email address'}</button><span className="copy-status" role="status" aria-atomic="true">{message}</span></div></div>
    <a className="phone-link" href={profile.phone.href}><Phone size={18} aria-hidden="true"/>{profile.phone.display}</a>
    <div className="social-row"><span className="mono">FIND ME ELSEWHERE</span><ExternalLink href={profile.social.linkedin}>LinkedIn</ExternalLink><ExternalLink href={profile.social.github}>GitHub</ExternalLink></div>
  </div></section>;
}
export function Footer(){return <footer className="site-footer"><div className="container">
  <div className="footer-main">
    <div className="footer-profile"><Link to="/" className="footer-brand"><span className="footer-monogram" aria-hidden="true">ns<span>.</span></span>Nethma Samadhi<span className="text-mint">.</span></Link><p>Software Engineering undergraduate at ICBT Campus, building practical digital solutions across software, web and data.</p><span className="footer-status"><span className="status-dot"/>Open to opportunities · Sri Lanka</span></div>
    <div className="footer-pages"><p className="footer-label">EXPLORE</p><nav aria-label="Footer navigation">{pages.map(page=><Link key={page.path} to={page.path}>{page.label}<ArrowUpRight size={13} aria-hidden="true"/></Link>)}</nav></div>
    <div className="footer-connect"><p className="footer-label">LET’S CONNECT</p><a className="footer-contact-link" href={`mailto:${profile.email}`} aria-label="Email Nethma"><Mail size={17} aria-hidden="true"/>{profile.email}</a><a className="footer-contact-link" href={profile.phone.href} aria-label="Call Nethma"><Phone size={17} aria-hidden="true"/>{profile.phone.display}</a><div className="footer-socials"><a href={profile.social.github} target="_blank" rel="noopener noreferrer" aria-label="Nethma on GitHub (opens in a new tab)"><Github size={19} aria-hidden="true"/></a><a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Nethma on LinkedIn (opens in a new tab)"><Linkedin size={19} aria-hidden="true"/></a><Link to="/contact" aria-label="Open contact page"><ArrowUpRight size={20} aria-hidden="true"/></Link></div></div>
  </div>
  <div className="footer-bottom"><p>© 2026 Nethma Samadhi.</p><span>SOFTWARE · WEB · DATA</span><Link to="#main">Back to top<ArrowUp size={16} aria-hidden="true"/></Link></div>
</div></footer>;}
