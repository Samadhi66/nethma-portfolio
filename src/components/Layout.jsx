import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { ArrowUpRight, ArrowUp, Menu, X, Download, Copy, Check } from 'lucide-react';
import { profile } from '../data/profile';
import { ExternalLink } from './UI';

const links = [['Projects','projects'],['Experience','experience'],['Expertise','expertise'],['About','about'],['Contact','contact']];
export function Navigation() {
  const location = useLocation();
  const [open,setOpen] = useState(false);
  const [active,setActive] = useState('');
  const toggle = useRef(null);
  const menu = useRef(null);
  useEffect(()=>{
    setOpen(false);
    if (location.pathname !== '/') {setActive('');return;}
    let frame;
    const update = ()=>{
      cancelAnimationFrame(frame);
      frame=requestAnimationFrame(()=>{
        const current=links.map(([,id])=>document.getElementById(id)).filter(Boolean).filter(section=>section.getBoundingClientRect().top<=180).at(-1);
        setActive(current?.id || '');
      });
    };
    update(); window.addEventListener('scroll',update,{passive:true});
    return ()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',update);};
  },[location]);
  useEffect(()=>{
    if (!open) return;
    menu.current?.querySelector('a')?.focus();
    const onKey=event=>{if(event.key==='Escape'){setOpen(false);toggle.current?.focus();}};
    const onPointer=event=>{if(!menu.current?.contains(event.target)&&!toggle.current?.contains(event.target))setOpen(false);};
    const media=window.matchMedia('(min-width: 801px)');
    const onResize=()=>{if(media.matches)setOpen(false);};
    document.addEventListener('keydown',onKey);document.addEventListener('pointerdown',onPointer);media.addEventListener('change',onResize);
    return ()=>{document.removeEventListener('keydown',onKey);document.removeEventListener('pointerdown',onPointer);media.removeEventListener('change',onResize);};
  },[open]);
  const navLink=([label,id])=><Link key={id} to={`/#${id}`} className={active===id?'is-active':undefined} aria-current={active===id?'location':undefined} onClick={()=>setOpen(false)}>{label}</Link>;
  return <header className="site-header" onBlur={event=>{if(open&&!event.currentTarget.contains(event.relatedTarget))setOpen(false);}}>
    <div className="container header-inner"><Link to="/" aria-label="Nethma Samadhi home" className="wordmark"><span className="brand-monogram" aria-hidden="true">ns<span>.</span></span><span>nethma<span className="wordmark-surname"> samadhi</span></span></Link>
      <nav className="desktop-nav" aria-label="Primary navigation">{links.map(navLink)}</nav>
      <a className="header-cv" href={profile.cv} download>CV<Download size={17} aria-hidden="true"/></a>
      <button ref={toggle} type="button" className="menu-toggle" aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open} aria-controls="mobile-nav" onClick={()=>setOpen(value=>!value)}>{open?<X size={23} aria-hidden="true"/>:<Menu size={23} aria-hidden="true"/>}</button>
    </div>
    <nav ref={menu} id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation" hidden={!open}>{links.map(navLink)}<a href={profile.cv} download>Download CV<Download size={17} aria-hidden="true"/></a></nav>
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
  return <section id="contact" tabIndex={-1} aria-labelledby="contact-title" className="contact-section"><div className="container"><p className="eyebrow"><span className="status-dot"/> LET’S CONNECT</p>
    <div className="contact-heading"><h2 id="contact-title">Have an opportunity<br/><span className="text-mint">in mind?</span></h2><a className="contact-arrow" href={`mailto:${profile.email}`} aria-label="Email Nethma Samadhi"><ArrowUpRight strokeWidth={1.2} size={60} aria-hidden="true"/></a></div>
    <div className="contact-bottom"><p>I’m interested in early-career opportunities across software and web development, QA, technical analysis and digital operations.</p><div className="email-block"><a ref={email} className="email-link" href={`mailto:${profile.email}`}>{profile.email}</a><button type="button" onClick={copyEmail} className="copy-button">{copied?<Check size={16} aria-hidden="true"/>:<Copy size={16} aria-hidden="true"/>}{copied?'Copied':'Copy email address'}</button><span className="copy-status" role="status" aria-atomic="true">{message}</span></div></div>
    <div className="social-row"><span className="mono">FIND ME ELSEWHERE</span><ExternalLink href={profile.social.linkedin}>LinkedIn</ExternalLink><ExternalLink href={profile.social.github}>GitHub</ExternalLink><a href={profile.cv} download>Download CV<Download size={17} aria-hidden="true"/></a></div>
  </div></section>;
}
export function Footer(){return <footer className="site-footer container"><Link to="/" className="footer-name">Nethma Samadhi<span>.</span></Link><p>Software engineering. A practical perspective.</p><Link to="#main">Back to top<ArrowUp size={17} aria-hidden="true"/></Link></footer>;}
