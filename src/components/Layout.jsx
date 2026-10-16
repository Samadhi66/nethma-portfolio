import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { ArrowUpRight, ArrowUp, Menu, X, Download } from 'lucide-react';
import { profile } from '../data/profile';
import { ExternalLink } from './UI';

const links = [['Projects', 'projects'], ['Experience', 'experience'], ['Expertise', 'expertise'], ['About', 'about']];
export function Navigation() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  useEffect(() => {
    if (location.pathname !== '/') {setActive(''); return;}
    const sections = [...document.querySelectorAll('main section[id]')];
    const observer = new IntersectionObserver(entries => {for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);}, {rootMargin: '-15% 0px -60% 0px', threshold: 0});
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, [location.pathname]);
  const toggle = useRef(null);
  const menu = useRef(null);
  useEffect(() => {setOpen(false);}, [location]);
  useEffect(() => {
    if (!open) return;
    const onKey = event => {if (event.key === 'Escape') {setOpen(false); toggle.current?.focus();}};
    const onClick = event => {if (!menu.current?.contains(event.target) && !toggle.current?.contains(event.target)) setOpen(false);};
    document.addEventListener('keydown', onKey); document.addEventListener('pointerdown', onClick);
    return () => {document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onClick);};
  }, [open]);
  return <header className="site-header"><div className="container header-inner"><Link to="/" aria-label="Nethma Samadhi home" className="wordmark">nethma<span>.</span><span className="wordmark-surname">samadhi</span></Link><nav className="desktop-nav" aria-label="Primary navigation">{links.map(([label, id]) => <Link key={id} to={`/#${id}`} className={active === id ? 'is-active' : undefined} aria-current={active === id ? 'location' : undefined}>{label}</Link>)}</nav><Link to="/#contact" className="header-contact">Let’s connect <ArrowUpRight size={15} aria-hidden="true"/></Link><button ref={toggle} type="button" className="menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>{open ? <X size={22}/> : <Menu size={22}/>}</button></div><nav ref={menu} id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation" hidden={!open}>{links.map(([label,id]) => <Link key={id} to={`/#${id}`} onClick={() => setOpen(false)}>{label}<ArrowUpRight size={16}/></Link>)}<Link to="/#contact" onClick={() => setOpen(false)}>Contact<ArrowUpRight size={16}/></Link><a href={profile.cv} download>Download CV<Download size={16}/></a></nav></header>;
}
export function Contact() {
  const [message, setMessage] = useState('');
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copyEmail() {try {await navigator.clipboard.writeText(profile.email); setMessage('Email address copied.');} catch {setMessage('Please select the email address to copy it.');} clearTimeout(timer.current); timer.current = setTimeout(() => setMessage(''), 5000);}
  return <section id="contact" className="contact-section"><div className="container"><p className="eyebrow"><span className="status-dot"/> LET’S CONNECT</p><div className="contact-heading"><h2>Have an opportunity<br/><span>in mind?</span></h2><a className="contact-arrow" href={`mailto:${profile.email}`} aria-label="Email Nethma Samadhi"><ArrowUpRight strokeWidth={1} size={65}/></a></div><div className="contact-bottom"><p>I’m interested in early-career opportunities across software,<br className="desktop-break"/> web development, QA, technical analysis and digital operations.</p><div className="email-block"><a className="email-link" href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight size={18}/></a><button onClick={copyEmail} className="copy-button">Copy email address</button><span className="copy-status" role="status">{message}</span></div></div><div className="social-row"><span className="mono">ELSEWHERE</span><ExternalLink href={profile.social.linkedin}>LinkedIn</ExternalLink><ExternalLink href={profile.social.github}>GitHub</ExternalLink><a href={profile.cv} download>Download CV<Download size={14}/></a></div></div></section>;
}
export function Footer() {return <footer className="site-footer container"><Link to="/" className="footer-name">Nethma Samadhi<span>.</span></Link><p>Software, web & data.</p><a href="#main">Back to top<ArrowUp size={14}/></a></footer>;}
