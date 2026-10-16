import { motion as Motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Image } from 'lucide-react';

export function Reveal({children, className = '', delay = 0}) {
  const reduced = useReducedMotion();
  return <Motion.div initial={false} whileInView={reduced ? {} : {opacity: [0.3, 1], y: [28, 0]}} viewport={{once: true, amount: 0.12}} transition={{duration: 0.75, delay, ease: [0.22, 1, 0.36, 1]}} className={className}>{children}</Motion.div>;
}
export function SectionHeading({number, label, title, children}) {
  return <Reveal className="section-heading"><div><p className="eyebrow"><span>{number}</span> / {label}</p><h2>{title}</h2></div>{children && <p className="section-aside">{children}</p>}</Reveal>;
}
export function Tags({items}) {return <ul className="tags" aria-label="Technologies">{items.map(item => <li key={item}>{item}</li>)}</ul>;}
export function ProjectCover({project, compact = false}) {
  if (!project.cover) return <Screenshot project={project} compact={compact}/>;
  return <figure className={`project-cover ${compact ? 'compact-cover' : ''}`}><img src={project.cover.src} alt={project.cover.alt} width="1536" height="1024" loading="lazy" decoding="async"/><figcaption>AI-generated concept artwork · Not an application screenshot</figcaption></figure>;
}
export function Screenshot({project, index = 0, compact = false}) {
  const shot = project.screenshots[index];
  if (shot) return <figure className="actual-screenshot"><img src={shot.src} alt={shot.alt} loading="lazy" width="1200" height="750"/><figcaption>{shot.caption}</figcaption></figure>;
  return <div className={`screenshot-placeholder ${compact ? 'compact' : ''}`}><div className="placeholder-top"><span>{project.number} / ACADEMIC PROJECT</span><Image size={16} aria-hidden="true"/></div><div className="placeholder-center"><span className="frame-corner tl"/><span className="frame-corner tr"/><span className="frame-corner bl"/><span className="frame-corner br"/><span className="placeholder-monogram" aria-hidden="true">{project.slug === 'finai' ? 'FinAI' : project.slug === 'ayurvedic-medicine' ? 'AM' : project.slug === 'library-management' ? 'LM' : 'CS'}</span><p>{project.screenshotLabels[index] || project.shortTitle}</p></div><p className="placeholder-label">SCREENSHOT PLACEHOLDER <span>— ACTUAL IMAGE TO BE ADDED</span></p></div>;
}
export function ExternalLink({href, children, ...props}) {return <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}<ArrowUpRight size={15} aria-hidden="true"/><span className="sr-only"> (opens in a new tab)</span></a>;}
