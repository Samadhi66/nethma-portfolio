import { Link, Navigate, useLocation } from 'react-router';
import { ArrowDown, ArrowUpRight, Code2, BriefcaseBusiness, GraduationCap, Sparkles } from 'lucide-react';
import { profile } from '../data/profile';
import { pages } from '../data/pages';
import { Reveal } from '../components/UI';

export default function Home() {
  const {hash}=useLocation();
  const legacyPage=pages.find(page=>page.path!== '/' && hash===`#${page.path.slice(1)}`);
  if(legacyPage) return <Navigate to={legacyPage.path} replace/>;
  return <>
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-scene" aria-hidden="true"><span className="hero-orbit"/><Code2 className="hero-code" strokeWidth={.5}/><span className="hero-floor"/></div>
      <div className="container studio-content">
        <Reveal className="studio-heading">
          <p className="eyebrow">SOFTWARE · WEB · DATA &amp; ANALYSIS</p>
          <h1 id="hero-title" aria-label="Hi, I'm Nethma Samadhi.">NETHMA SAMADHI</h1>
          <p className="hero-statement">Software Engineering Undergraduate</p>
          <p className="hero-disciplines">Full-Stack Development <span>|</span> Web &amp; SEO <span>|</span> Practical Solutions</p>
          <p className="hero-description">{profile.subtitle}</p>
        </Reveal>
        <Reveal className="portrait-panel" delay={.15}>
          <figure><div className="studio-photo-frame"><img src="/images/nethma-samadhi-hero-final.webp" alt="Portrait of Nethma Samadhi" width="1122" height="1402" fetchPriority="high"/></div><figcaption><span><span className="status-dot"/> OPEN TO OPPORTUNITIES</span><span>BASED IN SRI LANKA ↗</span></figcaption></figure>
        </Reveal>
        <Reveal className="hero-actions" delay={.25}>
          <Link className="button button-primary" to="/projects">EXPLORE PROJECTS<ArrowUpRight size={20} aria-hidden="true"/></Link>
        </Reveal>
        <div className="studio-bottom">
          <div className="hero-credentials" aria-label="Portfolio highlights">
            <span><GraduationCap aria-hidden="true"/>ICBT CAMPUS<small>Software Engineering · Studies completed</small></span>
            <span><BriefcaseBusiness aria-hidden="true"/>CURRENTLY AT eBEYONDS<small>Web Content &amp; SEO Assistant</small></span>
            <span><Code2 aria-hidden="true"/>SOFTWARE &amp; WEB<small>Building. Learning. Exploring.</small></span>
          </div>
          <Link className="hero-contact" to="/contact"><small>Have something in mind?</small>LET’S CONNECT<ArrowUpRight size={17} aria-hidden="true"/></Link>
          <Link className="hero-scroll" to="/about">DISCOVER MORE<ArrowDown size={17} aria-hidden="true"/></Link>
        </div>
      </div>
    </section>
    <div className="discipline-strip" aria-label="Areas of interest"><div>{[0, 1].map(copy => <span className="discipline-track" key={copy} aria-hidden={copy === 1}>{['DEVELOPMENT', 'WEB EXPERIENCES', 'DATA & ANALYSIS', 'CONTINUOUS LEARNING'].map(label => <span key={label}>{label}<Sparkles size={19} aria-hidden="true"/></span>)}</span>)}</div></div>
  </>;
}
